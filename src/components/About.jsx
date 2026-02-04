import React from 'react';
import { FiShield, FiTruck, FiHeadphones, FiStar, FiUsers, FiPackage } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';

const About = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const features = [
    {
      icon: <FiShield />,
      title: language === 'ar' ? 'آمن ومضمون' : 'Secure & Safe',
      description: language === 'ar' 
        ? 'جميع معاملاتك محمية ومشفرة'
        : 'All your transactions are protected and encrypted',
    },
    {
      icon: <FiTruck />,
      title: language === 'ar' ? 'شحن سريع' : 'Fast Delivery',
      description: language === 'ar'
        ? 'توصيل سريع وآمن في جميع أنحاء مصر'
        : 'Fast and secure delivery across Egypt',
    },
    {
      icon: <FiHeadphones />,
      title: language === 'ar' ? 'دعم 24/7' : '24/7 Support',
      description: language === 'ar'
        ? 'فريق دعم متاح على مدار الساعة'
        : 'Support team available around the clock',
    },
    {
      icon: <FiStar />,
      title: language === 'ar' ? 'منتجات مميزة' : 'Premium Products',
      description: language === 'ar'
        ? 'منتجات عالية الجودة مختارة بعناية'
        : 'High-quality products carefully selected',
    },
    {
      icon: <FiUsers />,
      title: language === 'ar' ? 'خصوصية كاملة' : 'Complete Privacy',
      description: language === 'ar'
        ? 'خصوصيتك هي أولويتنا القصوى'
        : 'Your privacy is our top priority',
    },
    {
      icon: <FiPackage />,
      title: language === 'ar' ? 'تغليف منفصل' : 'Discrete Packaging',
      description: language === 'ar'
        ? 'تغليف منفصل ومحترم لخصوصيتك'
        : 'Discrete and respectful packaging for your privacy',
    },
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-header">
          <h2 className="about-title">
            {language === 'ar' ? 'من نحن' : 'About Us'}
          </h2>
          <p className="about-subtitle">
            {language === 'ar'
              ? 'متجرك الموثوق للمنتجات المميزة'
              : 'Your trusted store for premium products'}
          </p>
        </div>

        <div className="about-content">
          <div className="about-main">
            <div className="about-text">
              <h3>{language === 'ar' ? 'قصتنا' : 'Our Story'}</h3>
              <p>
                {language === 'ar'
                  ? 'باور ستور هو متجر إلكتروني متخصص في تقديم منتجات مميزة وعالية الجودة للعملاء في مصر. نحن ملتزمون بتوفير تجربة تسوق مريحة وآمنة مع ضمان الخصوصية التامة لجميع عملائنا.'
                  : 'Power Store is an online store specializing in providing premium and high-quality products to customers in Egypt. We are committed to providing a comfortable and secure shopping experience while ensuring complete privacy for all our customers.'}
              </p>
              <p>
                {language === 'ar'
                  ? 'نؤمن بأن الجميع يستحقون الوصول إلى منتجات عالية الجودة في بيئة آمنة ومحترمة. فريقنا يعمل بجد لضمان أن كل طلب يتم معالجته بعناية وتوصيله بأمان إلى باب منزلك.'
                  : 'We believe everyone deserves access to high-quality products in a safe and respectful environment. Our team works hard to ensure every order is carefully processed and safely delivered to your doorstep.'}
              </p>
            </div>

            <div className="about-mission">
              <h3>{language === 'ar' ? 'مهمتنا' : 'Our Mission'}</h3>
              <p>
                {language === 'ar'
                  ? 'مهمتنا هي توفير منتجات مميزة وعالية الجودة مع ضمان تجربة تسوق مريحة وآمنة. نحن ملتزمون بالخصوصية والجودة والرضا الكامل للعملاء.'
                  : 'Our mission is to provide premium and high-quality products while ensuring a comfortable and secure shopping experience. We are committed to privacy, quality, and complete customer satisfaction.'}
              </p>
            </div>

            <div className="about-values">
              <h3>{language === 'ar' ? 'قيمنا' : 'Our Values'}</h3>
              <ul>
                <li>
                  <strong>{language === 'ar' ? 'الخصوصية:' : 'Privacy:'}</strong>{' '}
                  {language === 'ar'
                    ? 'نحمي خصوصيتك بكل الطرق الممكنة'
                    : 'We protect your privacy in every way possible'}
                </li>
                <li>
                  <strong>{language === 'ar' ? 'الجودة:' : 'Quality:'}</strong>{' '}
                  {language === 'ar'
                    ? 'نختار فقط أفضل المنتجات'
                    : 'We select only the best products'}
                </li>
                <li>
                  <strong>{language === 'ar' ? 'الاحترام:' : 'Respect:'}</strong>{' '}
                  {language === 'ar'
                    ? 'نحترم جميع عملائنا ونقدر ثقتهم'
                    : 'We respect all our customers and value their trust'}
                </li>
                <li>
                  <strong>{language === 'ar' ? 'الشفافية:' : 'Transparency:'}</strong>{' '}
                  {language === 'ar'
                    ? 'نكون واضحين ومباشرين في جميع معاملاتنا'
                    : 'We are clear and direct in all our transactions'}
                </li>
              </ul>
            </div>
          </div>

          <div className="about-features">
            <h3>{language === 'ar' ? 'لماذا تختارنا؟' : 'Why Choose Us?'}</h3>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-contact">
            <h3>{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h3>
            <div className="contact-info">
              <div className="contact-item">
                <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong>
                <span>support@powerstore.com</span>
              </div>
              <div className="contact-item">
                <strong>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong>
                <span>+20 123 456 7890</span>
              </div>
              <div className="contact-item">
                <strong>{language === 'ar' ? 'ساعات العمل:' : 'Working Hours:'}</strong>
                <span>{language === 'ar' ? '24/7' : '24/7'}</span>
              </div>
            </div>
          </div>

          <div className="about-age-restriction">
            <div className="age-restriction-box">
              <h4>{language === 'ar' ? '⚠️ تنبيه مهم' : '⚠️ Important Notice'}</h4>
              <p>
                {language === 'ar'
                  ? 'يجب أن يكون عمرك 18 عامًا أو أكثر لشراء المنتجات من متجرنا. نحن ملتزمون ببيع منتجاتنا فقط للبالغين المؤهلين.'
                  : 'You must be 18 years or older to purchase products from our store. We are committed to selling our products only to qualified adults.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
