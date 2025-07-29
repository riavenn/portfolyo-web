import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaLinkedinIn,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";
import { SiJavascript, SiTypescript } from "react-icons/si";
import Slider from "react-slick";
import emailjs from "emailjs-com";
import { Link } from "react-scroll";
import Projects from "./components/Projects";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabaseService } from "./lib/supabase";

function FadeInSection(props) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div ref={ref} className={`fade-in-section ${inView ? "is-visible" : ""}`}>
      {props.children}
    </div>
  );
}

// Ana sayfa bileşeni
function HomePage() {
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        setLoading(true);

        // Önce Supabase'den site içeriğini yüklemeye çalış
        const supabaseContent = await supabaseService.getSiteContent();

        if (supabaseContent) {
          setSiteContent(supabaseContent);
        } else {
          // Supabase'de veri yoksa localStorage'dan yükle
          const savedContent = localStorage.getItem("siteContent");
          if (savedContent) {
            setSiteContent(JSON.parse(savedContent));
          }
        }
      } catch (error) {
        console.error("Supabase'den site içeriği yüklenirken hata:", error);
        // Hata durumunda localStorage'a geri dön
        const savedContent = localStorage.getItem("siteContent");
        if (savedContent) {
          setSiteContent(JSON.parse(savedContent));
        }
      } finally {
        setLoading(false);
      }
    };

    loadSiteContent();

    // Real-time subscription for site content updates
    const subscription = supabaseService.subscribeToSiteContent((payload) => {
      console.log("Site content updated:", payload);
      if (payload.new && payload.new.content) {
        setSiteContent(payload.new.content);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      supabaseService.unsubscribe(subscription);
    };
  }, []);

  // Yükleme ekranını kaldırdık, içerik hazır olana kadar bekleyeceğiz
  if (loading) {
    return null; // İçerik yüklenene kadar hiçbir şey gösterme
  }

  return (
    <div className="App">
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={process.env.PUBLIC_URL + "/avatar.png"}>
          <source src={"/header-bg.mp4"} type="video/mp4" />
          <track kind="captions" srcLang="tr" label="Türkçe Altyazı" />{" "}
          <track kind="descriptions" srcLang="tr" label="Türkçe Açıklamalar" />{" "}
        </video>
      </div>
      <Navbar />
      <FadeInSection>
        <section id="header">
          <Header siteContent={siteContent} />
        </section>
      </FadeInSection>
      <FadeInSection>
        <section id="services">
          <Services siteContent={siteContent} />
        </section>
      </FadeInSection>
      <FadeInSection>
        <section id="projects">
          <Projects />
        </section>
      </FadeInSection>
      <FadeInSection>
        <section id="contact">
          <Contact siteContent={siteContent} />
        </section>
      </FadeInSection>
      <Footer siteContent={siteContent} />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link
          to="header"
          spy={true}
          smooth={true}
          offset={-70}
          duration={0}
          onClick={handleNavClick}
          style={{ textDecoration: "none" }}>
          <span className="logo-text">MS</span>
          <div className="logo-underline"></div>
        </Link>
      </div>
      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <Link
          to="header"
          spy={true}
          smooth={true}
          offset={-70}
          duration={0}
          onClick={handleNavClick}>
          Anasayfa
        </Link>
        <Link
          to="services"
          spy={true}
          smooth={true}
          offset={-70}
          duration={0}
          onClick={handleNavClick}>
          Hizmetler
        </Link>
        <Link
          to="projects"
          spy={true}
          smooth={true}
          offset={-70}
          duration={0}
          onClick={handleNavClick}>
          Projelerim
        </Link>
        <Link
          to="contact"
          spy={true}
          smooth={true}
          offset={-70}
          duration={0}
          onClick={handleNavClick}>
          İletişim
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

function TypeWriter({ siteContent }) {
  const titles = React.useMemo(() => {
    return (
      siteContent?.header?.animatedTitles || [
        "Web Tasarımı",
        "Web Site Tasarımı",
        "Web Geliştirme Hizmetleri",
      ]
    );
  }, [siteContent?.header?.animatedTitles]);
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const delaySpeed = 1500;

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % titles.length;
      const fullText = titles[i];

      setCurrentText(
        isDeleting
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1)
      );

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), delaySpeed);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, titles, titleIndex]);

  return <span className="animated-text">{currentText}</span>;
}

function Header({ siteContent }) {
  const skills = [
    { name: "HTML", icon: <FaHtml5 /> },
    { name: "CSS", icon: <FaCss3Alt /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "TypeScript", icon: <SiTypescript /> },
    { name: "React", icon: <FaReact /> },
  ];

  // Varsayılan değerler
  const defaultHeader = {
    name: "Mert Saykal",
    title: "Web Tasarımı",
    description:
      "Modern, şık ve kullanımı kolay web siteleri tasarlayan ve geliştiren bir front-end developer olarak, amacım her projede müşteri memnuniyetini en üst düzeyde tutmak ve olabildiğince başarılı işlere imza atmak. En son yenilikçi teknolojileri kullanarak, işletmenizin veya projenizin ruhunu yansıtan, hem göze hitap eden hem de kullanıcı dostu web deneyimleri yaratıyorum. Sadece bir web sitesi değil, markanızın dijital dünyadaki yüzünü en iyi şekilde temsil edecek bir platform inşa ediyorum. Gelin, dijital varlığınızı bir üst seviyeye taşıyacak, hayal ettiğiniz web sitesini birlikte tasarlayalım ve geliştirelim!",
    profileImage: "/avatar.jpg",
  };

  const defaultSocial = {
    linkedin: "https://www.linkedin.com/in/mert-saykal/",
    github: "https://github.com/riavenn",
    email: "mertsaykal0@gmail.com",
  };

  const headerData = siteContent?.header || defaultHeader;
  const socialData = siteContent?.social || defaultSocial;

  return (
    <header className="header" id="header">
      <div className="header-content">
        <div className="profile-image">
          <img
            src={process.env.PUBLIC_URL + headerData.profileImage}
            alt="Profil"
          />
          <div className="social-links">
            <a
              href={socialData.linkedin}
              target="_blank"
              rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
            <a
              href={socialData.github}
              target="_blank"
              rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href={`mailto:${socialData.email}`}>
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="profile-text">
          <h1>{headerData.name}</h1>
          <h2>
            <TypeWriter siteContent={siteContent} />
          </h2>
          <p className="about-me">{headerData.description}</p>
          <div className="header-skills">
            {skills.map((skill, index) => (
              <div key={index} className="header-skill-item">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Services({ siteContent }) {
  const defaultServices = [
    {
      title: "Web Geliştirme",
      image: "/web-dev.jpg",
      link: "#contact",
    },
    {
      title: "UI/UX Tasarımı",
      image: "/ui-ux.jpg",
      link: "#contact",
    },
    {
      title: "SEO Optimizasyonu",
      image: "/seo.jpg",
      link: "#contact",
    },
    {
      title: "Sosyal Medya Yönetimi",
      image: "/social.jpg",
      link: "#contact",
    },
  ];

  const services = siteContent?.services || defaultServices;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="services" id="services">
      <h2>Hizmetler</h2>
      <div className="services-slider-container">
        <Slider {...settings}>
          {services.map((service, index) => (
            <div key={index} className="service-item-slide">
              <div className="service-item">
                <div className="service-image-container">
                  <img
                    src={process.env.PUBLIC_URL + service.image}
                    alt={service.title}
                  />
                </div>
                <h3>{service.title}</h3>
                <Link
                  to="contact"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={0}
                  className="service-button">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

function Footer({ siteContent }) {
  const defaultSocial = {
    linkedin: "https://www.linkedin.com/in/mert-saykal/",
    github: "https://github.com/riavenn",
    email: "mertsaykal0@gmail.com",
  };

  const socialData = siteContent?.social || defaultSocial;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="logo">
          <div className="logo-underline"></div>
        </div>
        <div className="copyright">© 2025 Tüm hakları saklıdır.</div>
      </div>
      <div className="footer-bottom">
        <div className="social-icons">
          <a
            href={socialData.linkedin}
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
          <a href={socialData.github} target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href={`mailto:${socialData.email}`}>
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
}

function Contact({ siteContent }) {
  // contactData şu an kullanılmıyor ama gelecekte kullanılabilir
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const form = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSubmission = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleString("tr-TR"),
    };

    try {
      // Form verilerini Supabase'e kaydet
      await supabaseService.saveFormSubmission(newSubmission);

      // Aynı zamanda mevcut site içeriğini güncelle
      const currentContent = await supabaseService.getSiteContent();
      const updatedContent = {
        ...currentContent,
        contact: {
          ...currentContent?.contact,
          formSubmissions: [
            ...(currentContent?.contact?.formSubmissions || []),
            newSubmission,
          ],
        },
      };
      await supabaseService.saveSiteContent(updatedContent);
    } catch (error) {
      console.error("Form verisi Supabase'e kaydedilirken hata:", error);
      // Hata durumunda localStorage'a kaydet
      const savedContent = JSON.parse(
        localStorage.getItem("siteContent") || "{}"
      );
      const updatedContent = {
        ...savedContent,
        contact: {
          ...savedContent.contact,
          formSubmissions: [
            ...(savedContent.contact?.formSubmissions || []),
            newSubmission,
          ],
        },
      };
      localStorage.setItem("siteContent", JSON.stringify(updatedContent));
    }

    const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userID = process.env.REACT_APP_EMAILJS_USER_ID;

    if (!serviceID || !templateID || !userID) {
      alert(
        "EmailJS ayarları eksik. Lütfen .env dosyasını kontrol edin ve gerekli SERVICE_ID, TEMPLATE_ID ve USER_ID değerlerini ekleyin."
      );
      console.error("EmailJS environment variables are not set.");
      return;
    }

    emailjs.sendForm(serviceID, templateID, form.current, userID).then(
      (result) => {
        console.log(result.text);
        alert("Mesajınız başarıyla gönderildi!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      },
      (error) => {
        console.log(error.text);
        alert("Mesaj gönderilirken bir hata oluştu: " + error.text);
      }
    );
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-title">
          <h2>İLETİŞİM</h2>
        </div>
        <form ref={form} onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Adınız"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta Adresiniz"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Konu"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Mesajınız"
              required></textarea>
          </div>
          <button type="submit">Gönder</button>
        </form>
      </div>
    </section>
  );
}

export default App;
