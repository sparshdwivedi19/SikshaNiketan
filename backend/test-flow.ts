import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const API_URL = "http://localhost:5000/api/v1";

// Simple test runner logger
const log = (msg: string) => console.log(`[TEST] ${msg}`);
const success = (msg: string) => console.log(`[SUCCESS] ${msg}`);
const error = (msg: string) => console.error(`[ERROR] ${msg}`);

async function runTests() {
  log("Starting End-to-End QA Test...");

  let adminToken = "";
  let studentToken = "";
  let courseId = "";
  let courseSlug = "";
  let uploadedVideoUrl = "";
  let uploadedThumbnailUrl = "";

  const axiosInstance = axios.create({
    baseURL: API_URL,
    validateStatus: () => true // don't throw on error
  });

  try {
    // STEP 1: Login as Admin
    log("Logging in as Admin...");
    const adminLoginRes = await axiosInstance.post("/auth/login", {
      email: "admin@shiksha.com",
      password: "admin@123"
    });
    
    if (adminLoginRes.status !== 200) throw new Error(`Admin login failed: ${JSON.stringify(adminLoginRes.data)}`);
    adminToken = adminLoginRes.data.token;
    success("Admin login successful. Token received.");

    // Configure Admin Headers
    const adminConfig = {
      headers: { Authorization: `Bearer ${adminToken}` }
    };

    // STEP 2: Upload Dummy Video
    log("Uploading Video File...");
    const dummyVideoPath = path.join(process.cwd(), "dummy.mp4");
    if (!fs.existsSync(dummyVideoPath)) fs.writeFileSync(dummyVideoPath, "dummy video data");
    
    const videoFormData = new FormData();
    videoFormData.append("video", fs.createReadStream(dummyVideoPath));

    const videoUploadRes = await axiosInstance.post("/upload/video", videoFormData, {
      headers: { ...adminConfig.headers, ...videoFormData.getHeaders() }
    });

    if (videoUploadRes.status !== 200) throw new Error(`Video upload failed: ${JSON.stringify(videoUploadRes.data)}`);
    uploadedVideoUrl = videoUploadRes.data.url;
    success(`Video uploaded successfully. URL: ${uploadedVideoUrl}`);

    // STEP 3: Upload Dummy Thumbnail
    log("Uploading Thumbnail Image...");
    const dummyImagePath = path.join(process.cwd(), "dummy.jpg");
    if (!fs.existsSync(dummyImagePath)) fs.writeFileSync(dummyImagePath, "dummy image data");
    
    const imageFormData = new FormData();
    imageFormData.append("image", fs.createReadStream(dummyImagePath));

    const imageUploadRes = await axiosInstance.post("/upload/image", imageFormData, {
      headers: { ...adminConfig.headers, ...imageFormData.getHeaders() }
    });

    if (imageUploadRes.status !== 200) throw new Error("Image upload failed");
    uploadedThumbnailUrl = imageUploadRes.data.url;
    success(`Thumbnail uploaded successfully. URL: ${uploadedThumbnailUrl}`);

    // STEP 4: Create Course
    log("Creating Course...");
    const coursePayload = {
      title: "Automated QA Test Course",
      slug: "automated-qa-test-course-" + Date.now(),
      description: "This is a comprehensive test course.",
      thumbnail: uploadedThumbnailUrl,
      category: "JEE Main",
      level: "Class 11",
      price: 5000,
      isPublished: true,
      instructor: adminLoginRes.data.user._id || adminLoginRes.data.user.id
    };

    const createCourseRes = await axiosInstance.post("/courses", coursePayload, adminConfig);
    if (createCourseRes.status !== 201) throw new Error(`Course creation failed: ${JSON.stringify(createCourseRes.data)}`);
    
    courseId = createCourseRes.data.course._id;
    courseSlug = createCourseRes.data.course.slug;
    success(`Course created successfully. ID: ${courseId}`);

    // STEP 5: Create Curriculum
    log("Saving Curriculum...");
    const curriculumPayload = {
      modules: [
        {
          title: "Module 1: Introduction",
          lessons: [
            {
              title: "Welcome Video",
              type: "Video",
              size: "1 MB",
              videoUrl: uploadedVideoUrl
            }
          ]
        }
      ]
    };

    const curriculumRes = await axiosInstance.post(`/courses/${courseId}/lessons`, curriculumPayload, adminConfig);
    if (curriculumRes.status !== 200) throw new Error("Curriculum saving failed");
    success(`Curriculum saved successfully. Lesson count: ${curriculumRes.data.count}`);

    // STEP 6: Login as Student
    log("Logging in as Student...");
    const studentLoginRes = await axiosInstance.post("/auth/login", {
      email: "student@shiksha.com",
      password: "student@123"
    });
    
    if (studentLoginRes.status !== 200) throw new Error(`Student login failed: ${JSON.stringify(studentLoginRes.data)}`);
    studentToken = studentLoginRes.data.token;
    success("Student login successful.");

    // Configure Student Headers
    const studentConfig = {
      headers: { Authorization: `Bearer ${studentToken}` }
    };

    // STEP 7: Verify Visibility (Student fetching course)
    log("Verifying Course Visibility for Student...");
    const fetchCourseRes = await axiosInstance.get(`/courses/${courseSlug}`, studentConfig);
    
    if (fetchCourseRes.status !== 200) throw new Error(`Student failed to fetch course details: ${JSON.stringify(fetchCourseRes.data)}`);
    if (fetchCourseRes.data.lessons[0].videoUrl !== uploadedVideoUrl) {
      throw new Error("Video URL mismatch in student view");
    }
    success("Student successfully accessed course and verified video URL.");

    // STEP 8: Verify Access Control (Student tries to delete)
    log("Verifying Access Control (Student trying to delete course)...");
    const unauthorizedDeleteRes = await axiosInstance.delete(`/courses/${courseId}`, studentConfig);
    if (unauthorizedDeleteRes.status !== 403) {
      throw new Error(`Access control failed! Student could delete course. Status: ${unauthorizedDeleteRes.status}`);
    }
    success("Access control verified. Student cannot delete courses.");

    // STEP 9: Delete Course as Admin
    log("Deleting Course as Admin...");
    const deleteRes = await axiosInstance.delete(`/courses/${courseId}`, adminConfig);
    if (deleteRes.status !== 200) throw new Error("Failed to delete course");
    success("Course deleted successfully.");

    log("===================================");
    success("ALL E2E QA TESTS PASSED SUCCESSFULLY!");
    log("===================================");

  } catch (err: any) {
    error(`Test execution failed: ${err.message}`);
    process.exit(1);
  }
}

runTests();
