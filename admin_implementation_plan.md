# Admin Implementation Plan

File nay ghi cac buoc implement role Admin theo code hien tai.

## 1. API Backend

- [x] Dashboard: thong ke tong quan `/admin/stats`, bieu do `/admin/dashboard-chart`.
- [x] Audit logs: danh sach va filter `/admin/audit-logs`.
- [x] User management: danh sach, chi tiet, doi status, doi role.
- [x] Role management: tao, sua, xoa role.
- [x] Permission management: lay danh sach permission, gan permission cho role.
- [x] Referral management: danh sach referral verification, cap nhat trang thai.
- [x] Job admin actions: dong tin, gia han tin, tao/xem/duyet approval.
- [x] Application admin actions: xem tat ca application, cap nhat status.
- [x] Interview admin actions: xem tat ca interview, huy lich.

## 2. Frontend Admin

- [x] Dashboard dung API that thay mock data.
- [x] Users page dung API that, filter role/status/search, doi status/role.
- [x] Settings page quan ly role va permission.
- [x] Referrals page dung API that va co action verify/suspicious/expired.
- [x] Sidebar them link Referrals va Settings.

## 3. Viec can tiep tuc neu mo rong

- [ ] Them UI rieng cho Admin quan ly jobs/applications/interviews/master data.
- [ ] Them form tao user neu product yeu cau Admin tao tai khoan truc tiep.
- [ ] Them test e2e cho luong Admin.
- [ ] Chuan hoa encoding tieng Viet trong cac file cu dang bi mojibake.
