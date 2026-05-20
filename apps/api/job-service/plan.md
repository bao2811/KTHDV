

## Phân Tích Hệ Thống Tuyển Dụng Thông Minh
## — Nhóm 9
Mục lục
## 1  Tổng Quan Entity Map2
## 2  Danh Sách Entity Theo Service2
2.1  F1 — Job Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   2
2.2  F2 — Candidate Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   2
2.3  F3 — Matching Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   3
2.4  F4 — Interview Scheduler  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   3
2.5  F5 — Referral Verification Bot  . . . . . . . . . . . . . . . . . . . . . . . . . . .   3
2.6  F6 — Core / Cross-cutting . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   3
## 3  Business Rules4
3.1  F1 — Job Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   4
3.2  F2 — Candidate Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   4
3.3  F3 — Matching Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   4
3.4  F4 — Interview Scheduler  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   5
3.5  F5 — Referral Bot  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   5
3.6  F6 — Cross-cutting . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   5
4  Resources (REST API)5
4.1  F1 — Job Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   5
4.2  F2 — Candidate Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   6
4.3  F3 — Matching Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   6
4.4  F4 — Interview Scheduler  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   6
4.5  F5 — Referral Bot  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   7
4.6  F6 — Auth & Pipeline . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   7
## 5  Mối Quan Hệ Giữa Các Entity7
6  Chức Năng Theo Service (CRUD + Business Operations)8
6.1  F1 — Job Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   8
6.2  F2 — Candidate Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   8
6.3  F3 — Matching Service . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   8
6.4  F4 — Interview Scheduler  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   8
6.5  F5 — Referral Bot  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   9
6.6  F6 — Auth & Pipeline . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   9
7  Sơ đồ databases9
## 1

## 1  Tổng Quan Entity Map
(Sơ đồ thực thể Entity Map đã được lược bỏ trong bản in này.)
## 2  Danh Sách Entity Theo Service
## 2.1  F1 — Job Service
EntityMô tảAttributes chính
JobTin tuyển dụngid, title, description, salaryMin, salaryMax,
experienceYears, jobType
(Full-time/Part-time/Remote), status
(Draft/PendingApproval/Active/Closed/Expired),
publishedAt, expiredAt, createdBy
JobCategoryNgành nghềid, name, parentId (hỗ trợ phân cấp)
SkillKỹ năng yêu
cầu
id, name, category
JobSkillBảng trung gian
## Job ↔ Skill
jobId, skillId, level (Required/Nice-to-have),
minYears
LocationĐịa điểm làm
việc
id, city, district, address
JobApprovalPhê duyệt tinid, jobId, reviewerId, status
(Pending/Approved/Rejected), comment,
reviewedAt
CompanyCông ty đăng
tuyển
id, name, logo, industry, size, website
## 2.2  F2 — Candidate Service
EntityMô tảAttributes chính
CandidateỨng viênid, userId, profileId
CandidateProfileHồ sơ cá nhânid, fullName, email, phone, dateOfBirth,
address, summary
WorkExperienceKinh nghiệmid, profileId, company, position,
startDate, endDate, description
EducationHọc vấnid, profileId, school, degree, major,
startDate, endDate, gpa
CandidateSkillKỹ năng ứng viênid, profileId, skillId, yearsOfExp,
proficiency
ResumeFile CVid, candidateId, fileName, fileType
(PDF/DOCX), fileUrl, uploadedAt,
isPrimary
ApplicationĐơn ứng tuyểnid, candidateId, jobId, resumeId, status
(Submitted/Screening/Matched/Interviewing/Offered/Rejected/Withdrawn),
appliedAt
NotificationThông báoid, userId, type, title, content, isRead,
createdAt
## 2

## 2.3  F3 — Matching Service
EntityMô tảAttributes chính
MatchResultKết quả so khớpid, applicationId, jobId, candidateId,
overallScore, passedHardFilter, matchedAt
SkillMatchChi tiết kỹ năngid, matchResultId, skillId, requiredLevel,
candidateLevel, score
HardFilterBộ lọc cứngid, jobId, field
(experience/education/certification), operator
(≥,==), value
ExtractedKeywordTừ khóa NLPid, sourceType (JD/CV), sourceId, keyword,
category, confidence
## 2.4  F4 — Interview Scheduler
EntityMô tảAttributes chính
InterviewerNgười phỏng vấnid, userId, department, specialization
AvailabilitySlotKhung giờ rảnhid, userId, date, startTime, endTime,
isBooked
InterviewBuổi phỏng vấnid, applicationId, interviewerId,
scheduledAt, duration, type
(Online/Onsite), status
(Scheduled/Confirmed/Cancelled/Completed/Rescheduled),
meetingLink, notes
CalendarInviteLời mời lịchid, interviewId, provider
(Google/Zoom), externalEventId,
inviteUrl
## 2.5  F5 — Referral Verification Bot
EntityMô tảAttributes chính
ReferrerNgười tham chiếuid, resumeId, name, email, phone,
company, relationship
ReferralVerificationXác thực tham
chiếu
id, referrerId, candidateId, status
(Pending/Verified/Suspicious/Expired),
verificationToken, sentAt,
respondedAt
VerificationResponsePhản hồi xác thựcid, verificationId,
confirmedRelationship,
confirmedPeriod, rating, comments
## 2.6  F6 — Core / Cross-cutting
EntityMô tảAttributes chính
UserTài khoảnid, email, passwordHash, roleId, status
(Active/Inactive/Locked), createdAt
## 3

EntityMô tảAttributes chính
RoleVai tròid, name (Admin/Manager/HR/Candidate),
permissions[]
PermissionQuyền hạnid, resource, action
## (create/read/update/delete)
PipelineStageGiai đoạn pipelineid, name
(Submitted/Matched/Interviewing/Offered),
order, color
AuditLogNhật ký hệ thốngid, userId, action, resource, resourceId,
timestamp, details
## 3  Business Rules
## 3.1  F1 — Job Service
#Rule
BR-1.1Job phải được phê duyệt (Approved) trước khi chuyển sang Active và
hiển thị công khai
BR-1.2Job hết hạn (expiredAt< now) tự động chuyển sang Expired; HR có
thể gia hạn (tạo mới expiredAt)
BR-1.3Chỉ Job có status Active mới xuất hiện trong kết quả tìm kiếm
BR-1.4Khi Job chuyển sang Closed/Expired, tất cả Application đang
Submitted chuyển thành Rejected
BR-1.5salaryMin ≤ salaryMax; experienceYears ≥ 0
BR-1.6Một Job phải thuộc ít nhất 1 JobCategory và 1 Location
## 3.2  F2 — Candidate Service
#Rule
BR-2.1Mỗi Candidate chỉ được nộp 1 Application cho cùng 1 Job đang
## Active
BR-2.2Resume chỉ chấp nhận file PDF hoặc DOCX, dung lượng tối đa 10
## MB
BR-2.3Candidate phải có ít nhất 1 Resume để nộp đơn
BR-2.4Trạng thái Application chỉ chuyển tiến (Submitted → Screening →
Matched → Interviewing → Offered) hoặc loại (→
Rejected/Withdrawn) — không quay ngược
BR-2.5Khi Application chuyển trạng thái → tự động gửi Notification cho
## Candidate
## 3.3  F3 — Matching Service
#Rule
BR-3.1Hard Filter chạy trước; nếu ứng viên không đạt BẤT KỲ tiêu chí nào
→ passedHardFilter = false → loại ngay
BR-3.2overallScore nằm trong khoảng 0–100
## 4

#Rule
BR-3.3Matching chỉ chạy cho Application ở trạng thái Screening
BR-3.4Kết quả xếp hạng sắp xếp giảm dần theo overallScore; HR xem
danh sách top-down
BR-3.5Nếu overallScore ≥ ngưỡng (configurable) → tự động chuyển
Application sang Matched
## 3.4  F4 — Interview Scheduler
#Rule
BR-4.1Lịch phỏng vấn chỉ được tạo khi Application ở trạng thái Matched hoặc
## Interviewing
BR-4.2Không được đặt lịch trùng slot đã booked của Interviewer hoặc
## Candidate
BR-4.3Hủy lịch phải thông báo trước ít nhất 24h; nếu không → cảnh báo
BR-4.4Mỗi Interview phải có meeting link nếu type = Online
BR-4.5Interview Completed → HR phải nhập notes/feedback trong vòng
## 48h
## 3.5  F5 — Referral Bot
#Rule
BR-5.1Verification token hết hạn sau 7 ngày
BR-5.2Nếu Referrer không phản hồi sau 2 lần gửi email → status = Expired
BR-5.3Nếu thông tin Referrer phản hồi mâu thuẫn với CV → status =
## Suspicious
BR-5.4Mỗi Referrer chỉ xác thực 1 lần cho mỗi Candidate
## 3.6  F6 — Cross-cutting
#Rule
BR-6.1Mọi request phải qua API Gateway và mang JWT token hợp lệ
BR-6.2RBAC: Admin (full quyền), Manager (quản lý Job + xem báo cáo),
HR (CRUD Job + quản lý Application), Candidate (xem Job + nộp
đơn + xem trạng thái)
BR-6.3Pipeline stage chỉ chuyển tuần tự theo thứ tự order; không nhảy bước
BR-6.4Mọi thao tác thay đổi dữ liệu phải ghi AuditLog
4  Resources (REST API)
## 4.1  F1 — Job Service
MethodResourceMô tả
POST/api/jobsTạo tin tuyển dụng
GET/api/jobsDanh sách + tìm kiếm nâng cao
## 5

MethodResourceMô tả
GET/api/jobs/{id}Chi tiết tin
PUT/api/jobs/{id}Cập nhật tin
DELETE/api/jobs/{id}Xóa tin
PATCH/api/jobs/{id}/closeĐóng tin
PATCH/api/jobs/{id}/extendGia hạn tin
POST/api/jobs/{id}/approvalsGửi yêu cầu duyệt
PATCH/api/jobs/{id}/approvals/{approvalId}Duyệt/Từ chối
GET/api/categoriesDanh mục ngành nghề
GET/api/skillsDanh sách kỹ năng
GET/api/locationsDanh sách địa điểm
## 4.2  F2 — Candidate Service
MethodResourceMô tả
GET/PUT/api/candidates/{id}/profileXem/Cập nhật hồ sơ
CRUD/api/candidates/{id}/experiencesKinh nghiệm làm việc
CRUD/api/candidates/{id}/educationsHọc vấn
CRUD/api/candidates/{id}/skillsKỹ năng
POST/api/candidates/{id}/resumesUpload CV
GET/api/candidates/{id}/resumesDanh sách CV
GET/api/candidates/{id}/resumes/{rid}/previewXem trước CV
POST/api/jobs/{jobId}/applicationsNộp đơn ứng tuyển
GET/api/candidates/{id}/applicationsLịch sử ứng tuyển
GET/api/applications/{id}Chi tiết đơn
PATCH/api/applications/{id}/statusCập nhật trạng thái
## 4.3  F3 — Matching Service
MethodResourceMô tả
POST/api/jobs/{jobId}/matchTrigger matching cho Job
GET/api/jobs/{jobId}/match-resultsKết quả xếp hạng
GET/api/applications/{id}/match-resultKết quả match của 1 đơn
CRUD/api/jobs/{jobId}/hard-filtersQuản lý bộ lọc cứng
POST/internal/nlp/extract-keywordsTrích xuất từ khóa (internal)
## 4.4  F4 — Interview Scheduler
MethodResourceMô tả
CRUD/api/users/{id}/availabilityKhung giờ rảnh
POST/api/applications/{id}/interviewsTạo lịch phỏng vấn
GET/api/interviewsDanh sách phỏng vấn
PATCH/api/interviews/{id}/confirmXác nhận
PATCH/api/interviews/{id}/cancelHủy
PATCH/api/interviews/{id}/rescheduleDời lịch
## 6

MethodResourceMô tả
POST/api/interviews/{id}/meeting-linkTạo link họp
## 4.5  F5 — Referral Bot
MethodResourceMô tả
POST/api/resumes/{id}/extract-referrersBóc tách referrer từ CV
POST/api/referrers/{id}/verifyGửi email xác thực
GET/api/candidates/{id}/referral-statusTrạng thái xác thực
POST/public/verification/{token}Form phản hồi (public)
## 4.6  F6 — Auth & Pipeline
MethodResourceMô tả
POST/api/auth/registerĐăng ký
POST/api/auth/loginĐăng nhập → JWT
POST/api/auth/refreshRefresh token
GET/api/users/meThông tin user hiện tại
GET/api/jobs/{jobId}/pipelineKanban pipeline
PATCH/api/applications/{id}/pipeline-stageChuyển stage
## 5  Mối Quan Hệ Giữa Các Entity
(Sơ đồ luồng quan hệ đã được lược bỏ. Dưới đây là bảng tóm tắt chi tiết.)
Quan hệLoạiGhi chú
User → RoleN:1Mỗi user 1 role
Company → Job1:NCông ty có nhiều tin
Job ↔ SkillN:NQua bảng JobSkill
Job → JobCategoryN:1Mỗi tin thuộc 1 ngành
Job → LocationN:1Mỗi tin 1 địa điểm
Job → JobApproval1:NLịch sử duyệt
Candidate → CandidateProfile1:1Hồ sơ duy nhất
CandidateProfile → WorkExperience1:NNhiều kinh nghiệm
CandidateProfile → Education1:NNhiều bằng cấp
Candidate → Resume1:NNhiều CV
Candidate → Application1:NNhiều đơn
Application → JobN:1Đơn cho 1 Job
Application → MatchResult1:11 kết quả match
MatchResult → SkillMatch1:NChi tiết từng skill
Application → Interview1:NNhiều vòng phỏng vấn
Interview → InterviewerN:11 người phỏng vấn
Interviewer → AvailabilitySlot1:NNhiều slot rảnh
Resume → Referrer1:NNhiều người tham chiếu
Referrer → ReferralVerification1:11 lần xác thực/candidate
## 7

6  Chức Năng Theo Service (CRUD + Business Operations)
## 6.1  F1 — Job Service
Chức năngEntity tham giaLoại
Tạo tin tuyển dụngJob, JobSkill, HardFilterCRUD
Sửa/Xóa tinJobCRUD
Đóng tin tuyển dụngJob, ApplicationBusiness Op
Gia hạn tinJobBusiness Op
Duyệt tinJobApproval, JobBusiness Op
Tìm kiếm nâng caoJob, Skill, Location,
JobCategory
## Query
Cung cấp data cho
## Matching
Job, JobSkill, HardFilterInternal API
## 6.2  F2 — Candidate Service
Chức năngEntity tham giaLoại
CRUD hồ sơCandidateProfile,
WorkExperience, Education
## CRUD
Upload/Quản lý CVResumeCRUD
Xem trước CVResumeQuery
Nộp đơn ứng tuyểnApplication, ResumeBusiness Op
Theo dõi trạng tháiApplicationQuery
Gửi thông báo
realtime
NotificationEvent-driven
## 6.3  F3 — Matching Service
Chức năngEntity tham giaLoại
Trích xuất từ khóa NLPExtractedKeyword, Resume,
## Job
## Processing
Chạy Hard FilterHardFilter, CandidateProfileBusiness Op
Tính điểm tương đồngMatchResult, SkillMatchBusiness Op
Xếp hạng ứng viênMatchResultQuery
## 6.4  F4 — Interview Scheduler
Chức năngEntity tham giaLoại
Thiết lập giờ rảnhAvailabilitySlotCRUD
Auto-scheduleAvailabilitySlot, InterviewBusiness Op
Xác nhận/Hủy/Dời lịchInterviewBusiness Op
Tạo meeting linkCalendarInvite, InterviewIntegration
## 8

## 6.5  F5 — Referral Bot
Chức năngEntity tham giaLoại
Bóc tách referrer từ CVReferrer, ResumeProcessing
Gửi email xác thựcReferralVerificationBusiness Op
Theo dõi trạng tháiReferralVerificationQuery
Nhận phản hồiVerificationResponseBusiness Op
## 6.6  F6 — Auth & Pipeline
Chức năngEntity tham giaLoại
Đăng ký/Đăng nhậpUser, RoleAuth
Phân quyền RBACRole, PermissionAuth
Kanban pipelineApplication, PipelineStageQuery
Chuyển stageApplication, PipelineStageBusiness Op
Audit trailAuditLogCross-cutting
7  Sơ đồ databases
## 9