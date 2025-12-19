const form = document.getElementById("healthForm");
const submitBtn = form.querySelector(".submit-button");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Hiệu ứng nút bấm
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang tìm giải pháp...';
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-75", "cursor-wait");

    const formData = new FormData(form);
    const data = {};

    // Lấy thời gian
    data["⏰ Thời gian"] = new Date().toLocaleString("vi-VN", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });

    // Thu thập dữ liệu
    data["👤 Họ tên"] = formData.get("fullName") || "Bạn";
    data["Cảm thấy"] = formData.get("feelings") || "Không có";
    data["Kinh nguyệt"] = formData.get("menstrualFlow") || "Không có";
    data["Cân nặng"] = formData.get("weight") || "Không có";
    data["Thuốc tránh thai"] = formData.get("ocp") || "Không có";
    data["Thuốc ngoài"] = formData.get("medication");
    data["Giấc ngủ"] = formData.get("sleepQuality") || "Không có";
    data["Ghi chú"] = formData.get("notes") || "Không có";

    // Hàm lấy danh sách checkbox
    const checkedValues = (name) => {
        const values = formData.getAll(name);
        return values.length > 0 ? values : ["Không có"];
    };

    data["Tâm trạng"] = checkedValues("moods");
    data["Triệu chứng"] = checkedValues("symptoms");
    data["Tiêu hóa"] = checkedValues("digestion");
    data["Khác"] = checkedValues("other");
    data["Vận động"] = checkedValues("exercise");
    data["Tình dục"] = checkedValues("sexualActivity");
    data["Dịch âm đạo"] = checkedValues("vaginalDischarge");
    data["Rụng trứng"] = checkedValues("ovulationSigns");

    try {
        // Tạo lời khuyên chi tiết
        const advice = generateUltimateAdvice(data);
        const telegramMessage = formatDataForTelegram(data, advice);

        // Lưu dữ liệu
        localStorage.setItem("healthDataName", data["👤 Họ tên"]);
        localStorage.setItem("healthAdvice", advice);
        localStorage.setItem("pendingTelegramMessage", telegramMessage);

        // Chuyển trang
        setTimeout(() => {
            window.location.href = "results.html";
        }, 500);

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xử lý, bạn thử lại nhé!");
        submitBtn.innerHTML = 'Thử lại';
        submitBtn.disabled = false;
    }
});

function formatDataForTelegram(data, advice) {
    let message = `*🌺 NHẬT KÝ SỨC KHỎE 🌺*\n\n`;
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key];
            if (Array.isArray(value)) value = value.join(", ");
            message += `*${key}:* ${value}\n`;
        }
    }
    message += `\n*🌟 GIẢI PHÁP CHI TIẾT:*\n${advice}`;
    return message;
}

// --- HÀM TẠO LỜI KHUYÊN FULL 100% ---
function generateUltimateAdvice(rowData) {
    let adviceList = [];

    // Hàm thêm lời khuyên
    const addTip = (condition, icon, title, action) => {
        if (condition) {
            adviceList.push(`${icon} ${title}: ${action}`);
        }
    };

    // Lấy dữ liệu
    const s = rowData["Triệu chứng"]; // symptoms
    const m = rowData["Tâm trạng"]; // moods
    const d = rowData["Tiêu hóa"]; // digestion
    const e = rowData["Vận động"]; // exercise
    const sex = rowData["Tình dục"]; // sexualActivity
    const v = rowData["Dịch âm đạo"]; // vaginalDischarge
    const o = rowData["Rụng trứng"]; // ovulationSigns
    const f = rowData['Cảm thấy']; // feelings
    const oth = rowData["Khác"]; // other
    const flow = rowData['Kinh nguyệt'];

    // 1. TỔNG QUAN (Feelings)
    addTip(f === "Tốt", "🌟", "Tổng quan", "Tuyệt vời! Hãy tận dụng ngày đẹp trời này.");
    addTip(f === "Bình thường", "🍃", "Tổng quan", "Mọi thứ ổn định. Hãy duy trì thói quen tốt.");
    addTip(f === "Không tốt", "🌧️", "Tổng quan", "Đừng cố quá. Hãy nuông chiều bản thân hôm nay.");

    // 2. TÂM TRẠNG (Moods - Full list)
    if (m.includes("Bình tĩnh")) addTip(true, "😌", "Bình tĩnh", "Trạng thái tuyệt vời để ra các quyết định quan trọng.");
    if (m.includes("Vui vẻ")) addTip(true, "😄", "Vui vẻ", "Nụ cười là thuốc bổ, hãy lan tỏa nó nhé!");
    if (m.includes("Mạnh mẽ")) addTip(true, "💪", "Mạnh mẽ", "Bạn đang rất 'cháy'! Giải quyết ngay những việc khó nhất nào.");
    if (m.includes("Phấn chấn")) addTip(true, "✨", "Phấn chấn", "Năng lượng cao! Thích hợp để sáng tạo hoặc tập luyện.");
    if (m.includes("Thất thường")) addTip(true, "🌤️", "Thất thường", "Đừng lo, hormone thay đổi thôi. Chấp nhận cảm xúc lúc này.");
    if (m.includes("Bực bội")) addTip(true, "😠", "Bực bội", "Đi bộ nhanh hoặc đấm vào gối để xả năng lượng tiêu cực.");
    if (m.includes("Buồn")) addTip(true, "😢", "Buồn", "Khóc cũng là cách thải độc cho tâm hồn. Bạn sẽ ổn thôi.");
    if (m.includes("Lo lắng")) addTip(true, "😥", "Lo lắng", "Hít sâu 4s - Giữ 7s - Thở ra 8s. Làm 3 lần ngay đi.");
    if (m.includes("Trầm cảm")) addTip(true, "🤝", "Trầm cảm", "Hãy nhắn tin cho một người bạn thân. Đừng ở một mình quá lâu.");
    if (m.includes("Cảm thấy có lỗi")) addTip(true, "😔", "Tự trách", "Tha thứ cho bản thân đi. Ai cũng mắc sai lầm mà.");
    if (m.includes("Suy nghĩ ám ảnh")) addTip(true, "🧠", "Suy nghĩ nhiều", "Viết hết ra giấy (Brain dump) để giải phóng đầu óc.");
    if (m.includes("Thiếu năng lượng")) addTip(true, "🔋", "Hết pin", "Nghỉ ngơi ngay. Đừng uống thêm cafe, hãy uống nước lọc.");
    if (m.includes("Lãnh đạm")) addTip(true, "😶", "Lãnh đạm", "Thử nghe một bản nhạc sôi động để kích thích giác quan.");
    if (m.includes("Bối rối")) addTip(true, "😕", "Bối rối", "Đừng quyết định gì lúc này. Ngủ một giấc đã.");
    if (m.includes("Rất hay tự trách mình")) addTip(true, "😫", "Áp lực", "Hãy nói với mình: 'Tôi đã làm tốt nhất có thể rồi'.");

    // 3. TRIỆU CHỨNG (Symptoms - Full list)
    if (s.includes("Mọi thứ đều ổn")) addTip(true, "✅", "Sức khỏe", "Cơ thể ngoan. Hãy tự thưởng cho mình món gì đó ngon!");
    if (s.includes("Chuột rút")) addTip(true, "🔥", "Chuột rút", "Chườm ấm ngay. Bổ sung Magie (chuối, bơ, hạt).");
    if (s.includes("Sưng đau ngực")) addTip(true, "👙", "Đau ngực", "Thả rông khi ở nhà, massage nhẹ nhàng dưới vòi hoa sen ấm.");
    if (s.includes("Đau đầu")) addTip(true, "💆‍♀️", "Đau đầu", "Uống 1 cốc nước lớn. Rời xa màn hình điện thoại 20 phút.");
    if (s.includes("Mụn")) addTip(true, "🧼", "Mụn", "Đừng sờ tay lên mặt! Rửa mặt sạch và ngủ sớm.");
    if (s.includes("Đau lưng")) addTip(true, "🧘‍♀️", "Đau lưng", "Nằm ngửa, kê gối dưới đầu gối. Tránh ngồi sai tư thế.");
    if (s.includes("Mệt mỏi")) addTip(true, "💤", "Mệt mỏi", "Chợp mắt 15-20 phút (Power nap) để sạc lại pin.");
    if (s.includes("Thèm ăn")) addTip(true, "🍎", "Thèm ăn", "Cơ thể cần năng lượng. Chọn trái cây thay vì bánh ngọt.");
    if (s.includes("Mất ngủ")) addTip(true, "🌙", "Mất ngủ", "Ngâm chân nước ấm 10 phút trước khi lên giường.");
    if (s.includes("Đau bụng")) addTip(true, "🍵", "Đau bụng", "Uống trà gừng ấm. Nằm co người (tư thế bào thai).");
    if (s.includes("Ngứa âm đạo")) addTip(true, "⚠️", "Ngứa vùng kín", "Rửa sạch bằng nước ấm, lau khô. Tuyệt đối không gãi.");
    if (s.includes("Khô âm đạo")) addTip(true, "💧", "Khô hạn", "Uống thêm nước. Cân nhắc dùng gel bôi trơn dưỡng ẩm.");

    // 4. TIÊU HÓA (Digestion - Full list)
    if (d.includes("Bình thường")) addTip(true, "👍", "Tiêu hóa", "Hệ tiêu hóa tốt là chìa khóa của làn da đẹp.");
    if (d.includes("Buồn nôn")) addTip(true, "🍋", "Buồn nôn", "Ngửi vỏ chanh, uống trà gừng. Ăn đồ khô (bánh quy, bánh mì).");
    if (d.includes("Đầy hơi")) addTip(true, "🎈", "Đầy hơi", "Tránh đồ uống có ga. Thử động tác Yoga 'Ôm gối' để đẩy hơi.");
    if (d.includes("Táo bón")) addTip(true, "🥝", "Táo bón", "Ăn ngay đu đủ/thanh long. Uống nhiều nước vào buổi sáng.");
    if (d.includes("Tiêu chảy")) addTip(true, "🍞", "Tiêu chảy", "Ăn cháo trắng, chuối. Uống Oresol để bù điện giải.");

    // 5. KINH NGUYỆT (Menstrual Flow)
    if (flow === "Bình thường") addTip(true, "🩸", "Kinh nguyệt", "Chu kỳ ổn định. Nhớ thay băng vệ sinh mỗi 4 tiếng.");
    if (flow === "Ít") addTip(true, "📉", "Kinh ít", "Có thể do stress hoặc ăn kiêng. Theo dõi thêm chu kỳ sau.");
    if (flow === "Nhiều") addTip(true, "🍷", "Kinh nhiều", "Ăn thêm thịt bò, rau bina để bổ máu. Tránh vận động mạnh.");
    if (flow === "Cục máu đông") addTip(true, "⚠️", "Máu đông", "Uống nước ấm để máu lưu thông. Nếu đau dữ dội hãy đi khám.");

    // 6. KHÁC (Other - Full list)
    if (oth.includes("Đi lại")) addTip(true, "🚶", "Đi lại", "Vận động nhẹ nhàng giúp khí huyết lưu thông, giảm mệt mỏi.");
    if (oth.includes("Căng thẳng")) addTip(true, "🤯", "Căng thẳng", "Ngưng việc đang làm lại. Hít thở sâu 5 lần.");
    if (oth.includes("Thiền")) addTip(true, "🧘", "Thiền", "Tuyệt vời! Thiền giúp cân bằng hormone và cảm xúc.");
    if (oth.includes("Bài tập Kegel")) addTip(true, "🍑", "Kegel", "Rất tốt cho cơ sàn chậu. Tiếp tục duy trì nhé!");
    if (oth.includes("Bài tập thở")) addTip(true, "🌬️", "Tập thở", "Oxy là liều thuốc tự nhiên tốt nhất cho làn da và não bộ.");
    if (oth.includes("Bị bệnh hay bị thương")) addTip(true, "🚑", "Sức khỏe yếu", "Ưu tiên số 1 lúc này là nghỉ ngơi và tuân thủ y lệnh.");
    if (oth.includes("Rượu")) addTip(true, "🍷", "Có cồn", "Nhớ uống 1 ly nước lọc sau mỗi ly rượu để tránh mất nước/đau đầu.");

    // 7. THUỐC (Medication)
    const ocp = rowData["Thuốc tránh thai"];
    if (ocp === "Đã uống thuốc đúng giờ") addTip(true, "✅", "Tránh thai", "Rất tốt, bạn đang được bảo vệ an toàn.");
    if (ocp === "Đã uống bù/ quên thuốc") addTip(true, "⏰", "Quên thuốc", "Đặt báo thức cố định hàng ngày để không quên nữa nhé!");
    if (rowData["Thuốc ngoài"]) addTip(true, "💊", "Thuốc khác", `Bạn đang dùng thêm thuốc. Nhớ kiểm tra tương tác thuốc nhé.`);

    // 8. VẬN ĐỘNG (Exercise - Full list)
    if (e.includes("Không tập")) addTip(true, "🛋️", "Nghỉ ngơi", "Hôm nay nghỉ cũng được, nhưng đừng ngồi một chỗ quá lâu.");
    if (e.includes("Yoga")) addTip(true, "🧘‍♀️", "Yoga", "Nhớ thực hiện Savasana cuối buổi để thư giãn toàn thân.");
    if (e.includes("Gym")) addTip(true, "🏋️‍♀️", "Gym", "Nạp Protein sau tập để cơ bắp phục hồi nhé.");
    if (e.includes("Aerobic & nhảy múa")) addTip(true, "💃", "Nhảy", "Cách xả stress tuyệt vời nhất!");
    if (e.includes("Bơi lội")) addTip(true, "🏊‍♀️", "Bơi", "Nhớ dưỡng ẩm da và tóc sau khi bơi xong.");
    if (e.includes("Thể thao đồng đội")) addTip(true, "⚽", "Team sports", "Vừa khỏe vừa vui. Cẩn thận chấn thương va chạm.");
    if (e.includes("Chạy")) addTip(true, "🏃‍♀️", "Chạy bộ", "Giãn cơ kỹ sau khi chạy để tránh đau chân ngày mai.");
    if (e.includes("Đạp xe đạp")) addTip(true, "🚴‍♀️", "Đạp xe", "Bài tập tim mạch tuyệt vời và ít chấn thương.");
    if (e.includes("Đi bộ")) addTip(true, "🚶‍♀️", "Đi bộ", "Duy trì đi bộ 30p mỗi ngày là đủ để khỏe mạnh.");

    // 9. TÌNH DỤC (Sexual Activity - Full list)
    if (sex.includes("Không quan hệ tình dục")) addTip(true, "🚫", "Kiêng", "Dành thời gian chăm sóc bản thân theo cách khác.");
    if (sex.includes("Thủ dâm")) addTip(true, "🌸", "Self-love", "Cách an toàn để giảm stress và ngủ ngon. Nhớ vệ sinh tay.");
    if (sex.includes("Quan hệ tình dục có bảo vệ")) addTip(true, "🛡️", "An toàn", "Tuyệt vời. Bạn đang bảo vệ mình và đối tác rất tốt.");
    if (sex.includes("Quan hệ tình dục không bảo vệ")) addTip(true, "❗", "Nguy cơ", "Nếu lo lắng, hãy cân nhắc thuốc khẩn cấp và kiểm tra sức khỏe.");
    if (sex.includes("Quan hệ tình dục bằng miệng")) addTip(true, "👅", "Oral Sex", "Vẫn có nguy cơ lây bệnh (nhiệt miệng, viêm họng). Hãy chú ý vệ sinh.");
    if (sex.includes("Quan hệ tình dục qua đường hậu môn")) addTip(true, "🍑", "Anal Sex", "Sử dụng nhiều gel bôi trơn để tránh tổn thương. Vệ sinh kỹ.");
    if (sex.includes("Cực khoái")) addTip(true, "🎆", "Cực khoái", "Liều thuốc giảm đau và an thần tự nhiên tuyệt diệu.");
    if (sex.includes("Nhu cầu tình dục cao")) addTip(true, "🔥", "Ham muốn cao", "Dấu hiệu sức khỏe tốt hoặc đang rụng trứng.");
    if (sex.includes("Nhu cầu tình dục bình thường")) addTip(true, "😌", "Ham muốn ổn", "Cân bằng là tốt nhất.");
    if (sex.includes("Nhu cầu tình dục thấp")) addTip(true, "🧊", "Ham muốn thấp", "Đừng áp lực. Stress và mệt mỏi thường là nguyên nhân chính.");

    // 10. DỊCH ÂM ĐẠO (Vaginal Discharge - Full list)
    if (v.includes("Không có dịch")) addTip(true, "🌵", "Không dịch", "Bình thường ở những ngày vừa sạch kinh.");
    if (v.includes("Trắng đục")) addTip(true, "⚪", "Trắng đục", "Dịch sinh lý bình thường, không ngứa là ổn.");
    if (v.includes("Ẩm ướt")) addTip(true, "💧", "Ẩm ướt", "Cơ thể đang có nồng độ Estrogen tốt.");
    if (v.includes("Dạng dính")) addTip(true, "🍯", "Dịch dính", "Thường xuất hiện sau khi hết kinh.");
    if (v.includes("Như lòng trắng trứng")) addTip(true, "🥚", "Rụng trứng", "Thời điểm 'vàng' để thụ thai. Dịch này giúp tinh trùng di chuyển tốt.");
    if (v.includes("Dạng đốm")) addTip(true, "🔴", "Đốm máu", "Nếu không phải đến kỳ, có thể là máu báo rụng trứng hoặc tổn thương nhỏ.");
    if (v.includes("Bất thường") || v.includes("Trắng vón cục") || v.includes("Xám")) {
        addTip(true, "🚑", "Dịch lạ", "Dấu hiệu nấm hoặc viêm nhiễm. Nên đi khám phụ khoa sớm.");
    }

    // 11. RỤNG TRỨNG (Ovulation Signs - Full list)
    if (o.includes("Thay đổi nhiệt độ cơ sở")) addTip(true, "🌡️", "Nhiệt độ", "Thân nhiệt tăng nhẹ báo hiệu đã rụng trứng.");
    if (o.includes("Dịch nhầy âm đạo")) addTip(true, "💦", "Dịch nhầy", "Cửa sổ thụ thai đang mở.");
    if (o.includes("Xuất hiện đốm máu")) addTip(true, "🔴", "Máu rụng trứng", "Một chút máu là bình thường khi nang trứng vỡ.");
    if (o.includes("Tăng ham muốn tình dục")) addTip(true, "🔥", "Hứng khởi", "Cơ thể đang mời gọi theo bản năng tự nhiên.");
    if (o.includes("Sưng đầu ngực, đau vú")) addTip(true, "🤕", "Ngực căng", "Do progesterone tăng cao. Mặc áo rộng cho thoải mái.");
    if (o.includes("Đau bụng dưới và vùng chậu")) addTip(true, "💥", "Đau bụng", "Đau Mittelschmerz (giữa chu kỳ). Chườm ấm sẽ đỡ.");
    if (o.includes("Cổ tử cung mở rộng")) addTip(true, "🔓", "Cổ tử cung", "Cổ tử cung mềm, cao, mở - Dễ thụ thai nhất lúc này.");
    if (o.includes("Âm đạo hoặc âm hộ bị sưng")) addTip(true, "🎈", "Sưng nhẹ", "Do lưu lượng máu tăng cao vùng chậu, không sao cả.");
    if (o.includes("Đầy bụng") || o.includes("Đầy hơi")) addTip(true, "🤰", "Chướng bụng", "Ăn nhẹ, chia nhỏ bữa để giảm khó chịu.");
    if (o.includes("Buồn nôn")) addTip(true, "🤢", "Buồn nôn", "Nghỉ ngơi, uống nước gừng.");
    if (o.includes("Nhức đầu")) addTip(true, "🤯", "Đau đầu", "Nghỉ ngơi nơi tối, yên tĩnh.");

    // 12. CÂN NẶNG & GIẤC NGỦ
    const weight = parseFloat(rowData['Cân nặng']);
    if (weight && weight < 45) addTip(true, "🥑", "Cân nặng", "Hơi nhẹ cân. Bổ sung thêm bữa phụ dinh dưỡng nhé.");
    if (weight && weight > 65) addTip(true, "⚖️", "Cân nặng", "Duy trì vận động đều đặn để cơ thể săn chắc.");

    const sleep = rowData["Giấc ngủ"];
    if (sleep && sleep !== "Không có") addTip(true, "💤", "Giấc ngủ", `Bạn ghi: "${sleep}". Giấc ngủ rất quan trọng với nội tiết, ưu tiên nó nhé.`);

    if (adviceList.length === 0) {
        return "Hôm nay bạn ít chia sẻ quá. Hãy nhớ uống đủ nước và ngủ sớm nhé! 💖";
    }

    return adviceList.join('\n\n');
}

document.addEventListener("DOMContentLoaded", () => {
    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach((radio) => {

        radio.dataset.state = radio.checked ? "checked" : "unchecked";

        radio.addEventListener("click", function (e) {
            if (this.dataset.state === "checked") {
                this.checked = false;
                this.dataset.state = "unchecked";
            } else {
                const groupName = this.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach((r) => {
                    r.dataset.state = "unchecked";
                });
                this.dataset.state = "checked";
            }
        });
    });
});
