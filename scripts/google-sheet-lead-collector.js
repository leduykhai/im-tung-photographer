/**
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG LƯU LEAD VÀO GOOGLE SHEET & GỬI EMAIL MIỄN PHÍ
 * 
 * HƯỚNG DẪN 3 BƯỚC THIẾT LẬP (MẤT 2 PHÚT, MIỄN PHÍ 100%):
 * 1. Mở https://sheets.google.com -> Tạo một Bảng tính mới (đặt tên: "I'm Tung - Khách hàng tư vấn").
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xoá hết code cũ, dán toàn bộ đoạn mã bên dưới vào.
 * 4. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 *    - Loại: "Ứng dụng web" (Web app).
 *    - Mô tả: "I'm Tung Leads Collector".
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone).
 * 5. Bấm "Triển khai" -> Cấp quyền cho Google Tài khoản của bạn.
 * 6. Copy đường link URL Web App (dạng: https://script.google.com/macros/s/.../exec).
 * 7. Mở file `.env.local` trong dự án web, dán vào:
 *    LEAD_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 */

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var lead = contents.lead;
    if (!lead) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Missing lead data" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động tạo dòng tiêu đề nếu trang tính đang trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian gửi",
        "Họ và tên",
        "Số điện thoại",
        "Số Zalo",
        "Kênh ưu tiên",
        "Ngày cưới",
        "Tỉnh / Thành phố",
        "Địa điểm tổ chức",
        "Gói dịch vụ",
        "Email",
        "Album quan tâm",
        "Lời nhắn",
        "Trang gửi"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#f3f0ec");
    }

    // Định dạng thời gian Việt Nam
    var formattedDate = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "HH:mm:ss dd/MM/yyyy");

    sheet.appendRow([
      formattedDate,
      lead.fullName || "",
      lead.phone || "",
      lead.zaloNumber || "",
      lead.preferredChannel || "",
      lead.weddingDate || "",
      lead.province || "",
      lead.venue || "",
      lead.service || "",
      lead.email || "",
      lead.albumTitle || "",
      lead.message || "",
      lead.sourcePage || ""
    ]);

    // GỬI EMAIL THÔNG BÁO VỀ GMAIL (MIỄN PHÍ)
    // Thay đổi email của bạn nếu muốn nhận ở hòm thư khác
    var myEmail = "tungkhac12b4@gmail.com";
    var emailSubject = "💌 [Khách mới] " + (lead.fullName || "Khách hàng") + " vừa đăng ký tư vấn cưới!";
    var emailBody = 
      "Chào Tùng,\n\n" +
      "Bạn vừa có một yêu cầu tư vấn mới từ website I'm Tung Photographer:\n\n" +
      "• Khách hàng: " + (lead.fullName || "") + "\n" +
      "• Số điện thoại: " + (lead.phone || "") + "\n" +
      "• Zalo: " + (lead.zaloNumber || "Cùng số điện thoại") + "\n" +
      "• Kênh muốn tư vấn: " + (lead.preferredChannel || "") + "\n" +
      "• Ngày cưới dự kiến: " + (lead.weddingDate || "Chưa xác định") + "\n" +
      "• Tỉnh / Địa điểm: " + (lead.province || "") + (lead.venue ? " (" + lead.venue + ")" : "") + "\n" +
      "• Dịch vụ: " + (lead.service || "") + "\n" +
      "• Album quan tâm: " + (lead.albumTitle || "") + "\n" +
      "• Lời nhắn: " + (lead.message || "Không có") + "\n\n" +
      "Thời gian nhận: " + formattedDate + "\n" +
      "Xem chi tiết trong Google Sheet của bạn.";

    MailApp.sendEmail(myEmail, emailSubject, emailBody);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
