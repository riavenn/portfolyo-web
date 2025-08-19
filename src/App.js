import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import "./App.css";
import "./components/Services.css";
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaLinkedinIn,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";
import { SiJavascript, SiTypescript } from "react-icons/si";
import emailjs from "emailjs-com";
import { Link } from "react-scroll";
import Projects from "./components/Projects";
import Login from "./components/Login";

function FadeInSection(props) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });

  return (
    <div
      ref={ref}
      className={`fade-in-section ${inView ? "is-visible" : ""}`}>
      {props.children}
    </div>
  );
}

// Ana sayfa bileşeni
function HomePage() {
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
          <Header />
        </section>
      </FadeInSection>
      <FadeInSection>
        <section id="services">
          <Services />
        </section>
      </FadeInSection>
      <FadeInSection>
        <section id="projects">
          <Projects />
        </section>
      </FadeInSection>
      <FadeInSection>
        <section id="contact">
          <Contact />
        </section>
      </FadeInSection>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
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

function TypeWriter() {
  const titles = React.useMemo(
    () => [
      "Web Tasarımı",
      "Web Site Tasarımı",
      "Web Geliştirme Hizmetleri",
    ],
    []
  );
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

function Header() {
  const skills = [
    { name: "HTML", icon: <FaHtml5 /> },
    { name: "CSS", icon: <FaCss3Alt /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "TypeScript", icon: <SiTypescript /> },
    { name: "React", icon: <FaReact /> },
  ];

  const headerData = {
    name: "Mert Saykal",
    title: "Web Tasarımı",
    description1:
      "Modern, şık ve kullanımı kolay web siteleri tasarlayan ve geliştiren bir front-end developer olarak, amacım her projede müşteri memnuniyetini en üst düzeyde tutmak ve olabildiğince başarılı işlere imza atmak.",
    description2:
      "En son yenilikçi teknolojileri kullanarak, işletmenizin veya projenizin ruhunu yansıtan, hem göze hitap eden hem de kullanıcı dostu web deneyimleri yaratıyorum. Sadece bir web sitesi değil, markanızın dijital dünyadaki yüzünü en iyi şekilde temsil edecek bir platform inşa ediyorum.",
    description3:
      "Gelin, dijital varlığınızı bir üst seviyeye taşıyacak, hayal ettiğiniz web sitesini birlikte tasarlayalım ve geliştirelim!",
    profileImage: "/avatar.jpg",
  };

  const socialData = {
    linkedin: "https://www.linkedin.com/in/mert-saykal/",
    github: "https://github.com/riavenn",
    email: "mertsaykal0@gmail.com",
  };

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
          <div className="header-skills">
            {skills.map((skill, index) => (
              <div key={index} className="header-skill-item">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-text">
          <h1>{headerData.name}</h1>
          <h2>
            <TypeWriter />
          </h2>
          <div className="about-me-container">
            <p className="about-me">{headerData.description1}</p>
            <p className="about-me">{headerData.description2}</p>
            <p className="about-me">{headerData.description3}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Services() {
  const services = [
    {
      title: "Web Geliştirme",
      image: "/web-dev.jpg",
      description:
        "Modern ve performanslı web siteleri ile dijital dünyada yerinizi alın. Size özel çözümlerle markanızı en iyi şekilde temsil ediyoruz.",
      link: "#contact",
    },
    {
      title: "UI/UX Tasarımı",
      image: "/ui-ux.jpg",
      description:
        "Kullanıcı dostu ve estetik arayüzler tasarlayarak, kullanıcılarınızın web sitenizde keyifli bir deneyim yaşamasını sağlıyoruz.",
      link: "#contact",
    },
    {
      title: "SEO Optimizasyonu",
      image: "/seo.jpg",
      description:
        "Arama motorlarında üst sıralarda yer alarak daha fazla müşteriye ulaşın. Sitenizi SEO uyumlu hale getirerek organik trafiğinizi artırıyoruz.",
      link: "#contact",
    },
    {
      title: "Sosyal Medya Yönetimi",
      image: "/social.jpg",
      description:
        "Sosyal medya hesaplarınızı profesyonelce yöneterek marka bilinirliğinizi artırıyor ve hedef kitlenizle etkileşiminizi güçlendiriyoruz.",
      link: "#contact",
    },
  ];

  return (
    <section className="services" id="services">
      <h2 className="section-title">Hizmetler</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-image-container">
              <img
                src={process.env.PUBLIC_URL + service.image}
                alt={service.title}
              />
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
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
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const socialData = {
    linkedin: "https://www.linkedin.com/in/mert-saykal/",
    github: "https://github.com/riavenn",
    email: "mertsaykal0@gmail.com",
  };

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
    </footer>
  );
}

function Contact() {
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
          <h2 className="section-title">İLETİŞİM</h2>
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