import { useRef } from "react";
import html2pdf from "html2pdf.js";
import logo from "../../assets/images/adv_syrian.png";
import { useParams } from "react-router";
import { useGetOneBookingsQuery } from "../../RtkQuery/Slice/Booking/BookingApi";
import { styles } from "./ContractStyle";
import DOMPurify from "dompurify";
const ContractPage = () => {
  const contentRef = useRef(null);
  const param = useParams();
  const { data: getBooking, isSuccess } = useGetOneBookingsQuery(param.id);

  const contractDetails = {
    firstParty: {
      name: getBooking?.user.full_name,
      company: getBooking?.user?.company?.name,
      commercialRegister:
        getBooking?.user?.company?.commercial_registration_number,
      address: getBooking?.user?.company?.address,
      phone: getBooking?.user.phone_number,
      role: " مدير مبيعات",
    },
    secondParty: {
      name: getBooking?.customer.full_name,
      company: getBooking?.customer.company_name,
      commercialRegister: getBooking?.customer.commercial_registration_number,
      address: getBooking?.customer.address,
      phone: getBooking?.customer.phone_number,
    },
    introduction: {
      secondPartyDesire:
        "يرغب في الترويج للمنتجات العائدة للشركة من خلال الإعلانات الطرقية",
      firstPartyPossession:
        "يمتلك لوحات إعلانية طرقية بموجب ترخيص المؤسسة العربية للإعلان رقم / 4 / تاريخ 9/5/2012 ويملك حق الاعلان لذا اتفق الفريقان على ما يلي  ",
    },
  };

  const generatePdf = () => {
    const element = contentRef.current;
    const options = {
      margin: [10, 10, 10, 10],
      filename: `عقد_إعلاني.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true,
        dpi: 192,
        letterRendering: true,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          return element.tagName === "STYLE" || element.tagName === "LINK";
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        console.log("PDF generated successfully!");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("حدث خطأ أثناء إنشاء ملف PDF. يرجى مراجعة وحدة التحكم (F12).");
      });
  };

  const calculateDurationInYears = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.round(diffInYears * 10) / 10;
  };

  if (!isSuccess) {
    return <div className="text-center mt-5">...جاري توليد العقد </div>;
  }

  return (
    <div style={styles.contractPageContainer}>
      <button style={styles.pdfExportButton} onClick={generatePdf}>
        تصدير إلى PDF
      </button>

      <div style={styles.contractPage} ref={contentRef}>
        <div style={styles.header}>
          <img style={styles.logo} src={logo} alt="logo" />
          <h1 style={styles.headerH1}>عقد إعلاني</h1>
        </div>

        <div style={styles.partiesInfo}>
          <div style={styles.party}>
            <strong style={styles.partyH2}>الطرف الأول:</strong>
            {contractDetails.firstParty.company} المسجلة بالسجل التجاري رقم{" "}
            {contractDetails.firstParty.commercialRegister} الممثلة بالسيد{" "}
            {contractDetails.firstParty.name} بصفة{" "}
            {contractDetails.firstParty.role} و المتخذ عنوانا -{" "}
            {contractDetails.firstParty.address} - هاتف :{" "}
            {contractDetails.firstParty.phone}
          </div>

          <div style={styles.party}>
            <strong style={styles.partyH2}>الطرف الثاني:</strong> شركة{" "}
            {contractDetails.secondParty.company} المسجلة بالسجل التجاري رقم{" "}
            {contractDetails.secondParty.commercialRegister} الممثلة بالسيد{" "}
            {contractDetails.secondParty.name} و المتخذ عنوانا -{" "}
            {contractDetails.secondParty.address} - هاتف :{" "}
            {contractDetails.secondParty.phone}
          </div>
        </div>

        <div style={styles.introduction}>
          <h2 style={styles.introductionH2}>مقدمة:</h2>
          <p>
            حيث الفريق الثاني {contractDetails.introduction.secondPartyDesire}{" "}
            وبما أن الفريق الأول{" "}
            {contractDetails.introduction.firstPartyPossession} .
          </p>
        </div>

        <div style={styles.adDetailsSection}>
          <h2 style={styles.adDetailsSectionH2}>
            1- يتم الإعلان من خلال اللوحات المبنية بالجدول التالي:
          </h2>
          <table style={styles.adTable}>
            <thead>
              <tr>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  النموذج
                </th>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  النوع
                </th>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  مكان التموضع
                </th>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  عدد الأوجه
                </th>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  المدة الإعلانية (شهر)
                </th>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  السعر الإفرادي للأوجه شامل الطباعة لمرة واحدة
                </th>
              </tr>
            </thead>
            <tbody>
              {getBooking?.roadsigns?.map((ad, index) => (
                <tr key={index}>
                  <td style={styles.adTableThTd}>{ad.template?.model}</td>
                  <td style={styles.adTableThTd}>{ad.template?.type}</td>
                  <td style={styles.adTableThTd}>{ad?.place}</td>
                  <td style={styles.adTableThTd}>
                    {ad?.total_faces_on_date} وجه اعلاني
                  </td>
                  <td style={styles.adTableThTd}>
                    {/* {calculateDurationInYears(
                      ad?.pivot.start_date,
                      ad?.pivot.end_date
                    )} */}
                    {getBooking?.units} شهر
                  </td>
                  <td style={styles.adTableThTd}>{ad?.pivot.face_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <table style={styles.adTable}>
          <tbody>
            <tr>
              <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                القيمة الكلية قبل الحسم عن 28 يوم فترة إعلانية ( سنة )
              </th>
              <td style={styles.adTableThTd}>
                {getBooking?.total_price_befor_discount} $
              </td>
            </tr>
            {getBooking?.value && (
              <tr>
                <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                  حسم خاص مقدم من الشركة السورية
                </th>
                <td style={styles.adTableThTd}>
                  {getBooking.discount_type == 1 ? (
                    <span>{getBooking.value} $ </span>
                  ) : (
                    <span>{getBooking.value} %</span>
                  )}
                </td>
              </tr>
            )}
            <tr>
              <th style={{ ...styles.adTableThTd, ...styles.adTableTh }}>
                القيمة الكلية بعد الحسم عن 28 يوم فترة إعلانية ( سنة )
              </th>
              <td style={styles.adTableThTd}>{getBooking?.total_price} $ </td>
            </tr>
          </tbody>
        </table>

        <div style={{ margin: "20px 0" }}>
          <strong>
            - السعر يشمل أجور الطباعة لمرة واحدة فقط و تكاليف الرسوم الإعلانية.
          </strong>
          {getBooking?.groupedTemplates.map((tem, ind) => (
            <div key={ind}>
              <p>
                العدد الكلي لنموذج {tem?.model} بعدد{" "}
                <span>{tem?.total_faces} وجه إعلاني</span>
              </p>
            </div>
          ))}
        </div>

        <div>
          {getBooking?.notes ? (
            <div className="list-decimal pr-6">
              {(() => {
                const cleanText = DOMPurify.sanitize(getBooking.notes, {
                  ALLOWED_TAGS: [],
                });
                return cleanText.split(/(?=\d+-\s)/).map((item, index) => (
                  <p key={index} className="mb-2">
                    {item.trim()}
                  </p>
                ));
              })()}
            </div>
          ) : (
            <p>لا توجد ملاحظات</p>
          )}
        </div>

        <div style={{ margin: "20px 0" }}>
          <strong>
            - تبدأ الحملة الإعلانية بتاريخ{" "}
            {new Date(getBooking?.start_date).toLocaleDateString("en-US")} و
            تنتهي بتاريخ{" "}
            {new Date(getBooking?.end_date).toLocaleDateString("en-US")}
          </strong>
        </div>

        <p></p>

        <p></p>

        <div style={styles.signatures}>
          <div style={styles.signatureParty}>
            <h3 style={styles.signaturePartyH3}>
              {contractDetails.firstParty.company}
            </h3>
            <p>الفريق الأول: {contractDetails.firstParty.name}</p>
          </div>
          <div style={styles.signatureParty}>
            <h3 style={styles.signaturePartyH3}>
              {contractDetails.secondParty.company}
            </h3>
            <p>الفريق الثاني: {contractDetails.secondParty.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
