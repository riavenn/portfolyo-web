import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AdminPanel.css";
import { supabaseService } from "../lib/supabase";
import {
  FaSignOutAlt,
  FaUser,
  FaProjectDiagram,
  FaCog,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaHome,
  FaServicestack,
  FaEnvelope,
  FaShare,
} from "react-icons/fa";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "header");
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    imageUrl: "",
    demoUrl: "",
  });

  // Varsayılan site içeriği (App.js ile senkronize)
  const getDefaultSiteContent = () => ({
    header: {
      name: "Mert Saykal",
      title: "Web Tasarımı",
      animatedTitles: [
        "Web Tasarımı",
        "Web Site Tasarımı",
        "Web Geliştirme Hizmetleri",
      ],
      description:
        "Modern, şık ve kullanımı kolay web siteleri tasarlayan ve geliştiren bir front-end developer olarak, amacım her projede müşteri memnuniyetini en üst düzeyde tutmak ve olabildiğince başarılı işlere imza atmak. En son yenilikçi teknolojileri kullanarak, işletmenizin veya projenizin ruhunu yansıtan, hem göze hitap eden hem de kullanıcı dostu web deneyimleri yaratıyorum. Sadece bir web sitesi değil, markanızın dijital dünyadaki yüzünü en iyi şekilde temsil edecek bir platform inşa ediyorum. Gelin, dijital varlığınızı bir üst seviyeye taşıyacak, hayal ettiğiniz web sitesini birlikte tasarlayalım ve geliştirelim!",
      profileImage: "/avatar.jpg",
      skills: [
        { name: "HTML", icon: "FaHtml5" },
        { name: "CSS", icon: "FaCss3Alt" },
        { name: "JavaScript", icon: "SiJavascript" },
        { name: "TypeScript", icon: "SiTypescript" },
        { name: "React", icon: "FaReact" },
      ],
    },
    services: [
      { title: "Web Geliştirme", image: "/web-dev.jpg", link: "#contact" },
      { title: "UI/UX Tasarımı", image: "/ui-ux.jpg", link: "#contact" },
      { title: "SEO Optimizasyonu", image: "/seo.jpg", link: "#contact" },
      {
        title: "Sosyal Medya Yönetimi",
        image: "/social.jpg",
        link: "#contact",
      },
    ],
    contact: {
      email: "mertsaykal0@gmail.com",
      phone: "",
      address: "",
      formSubmissions: [],
    },
    social: {
      linkedin: "https://www.linkedin.com/in/mert-saykal/",
      github: "https://github.com/riavenn",
      email: "mertsaykal0@gmail.com",
    },
    siteSettings: {
      title: "Mert Saykal - Portfolio",
      description: "Modern web tasarımı ve geliştirme hizmetleri",
      keywords: "web tasarım, web geliştirme, frontend, react",
    },
  });

  // Site içeriği state'i
  const [siteContent, setSiteContent] = useState(getDefaultSiteContent());

  const [editingService, setEditingService] = useState(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newService, setNewService] = useState({ title: "", image: "" });

  const [editingSkill, setEditingSkill] = useState(null);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", icon: "" });

  const [newAnimatedTitle, setNewAnimatedTitle] = useState("");

  // Tab değiştirme fonksiyonu
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  useEffect(() => {
    // URL parametresinden tab'ı güncelle
    const currentTab = searchParams.get("tab");
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Giriş kontrolü
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
        if (!isLoggedIn) {
          navigate("/login");
          return;
        }

        // Supabase bağlantı testi kaldırıldı

        // Projeler için başlangıç verisi
        const initialProjects = [
          {
            id: 1,
            title: "Sephiron Hotel",
            imageUrl: process.env.PUBLIC_URL + "/project1.jpg",
            demoUrl: "https://sephiron-hotel.vercel.app/",
          },
          {
            id: 2,
            title: "Lezzet Durağı Restaurant",
            imageUrl: process.env.PUBLIC_URL + "/project2.jpg",
            demoUrl: "https://restaurant-web-kappa-pink.vercel.app/",
          },
          {
            id: 3,
            title: "Grand Max Luxury Hotel",
            imageUrl: process.env.PUBLIC_URL + "/project3.jpg",
            demoUrl: "https://hotel-web-five.vercel.app/",
          },
          {
            id: 4,
            title: "NISMED Klinik",
            imageUrl: process.env.PUBLIC_URL + "/project4.jpg",
            demoUrl: "https://healt-web.vercel.app/",
          },
          {
            id: 5,
            title: "Adalet Hukuk Bürosu",
            imageUrl: process.env.PUBLIC_URL + "/project5.jpg",
            demoUrl: "https://law-web-seven.vercel.app/",
          },
          {
            id: 6,
            title: "Bella Vista Restaurant",
            imageUrl: process.env.PUBLIC_URL + "/project6.jpg",
            demoUrl: "https://bellavista-restaurant.vercel.app/",
          },
        ];

        try {
          // Supabase'den projeleri yükle
          const supabaseProjects = await supabaseService.getProjects();
          if (supabaseProjects.length > 0) {
            // Supabase formatından local formata dönüştür
            const formattedProjects = supabaseProjects.map(project => ({
              id: project.project_id || project.id,
              title: project.title,
              imageUrl: project.image_url,
              demoUrl: project.demo_url
            }));
            setProjects(formattedProjects);
          } else {
            // Eğer Supabase'de veri yoksa, başlangıç verilerini kullan ve kaydet
            setProjects(initialProjects);
            await supabaseService.saveProjects(initialProjects);
          }
        } catch (supabaseError) {
          console.warn('Supabase projeler yüklenemedi, localStorage kullanılıyor:', supabaseError);
          // Supabase hatası durumunda localStorage'ı fallback olarak kullan
          const savedProjects = localStorage.getItem("adminProjects");
          if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
          } else {
            setProjects(initialProjects);
            localStorage.setItem("adminProjects", JSON.stringify(initialProjects));
          }
        }

        try {
          // Supabase'den site içeriğini yükle
          const supabaseSiteContent = await supabaseService.getSiteContent();
          if (supabaseSiteContent) {
            // Varsayılan değerlerle birleştir
            const mergedContent = {
              ...getDefaultSiteContent(),
              ...supabaseSiteContent,
              header: {
                ...getDefaultSiteContent().header,
                ...supabaseSiteContent.header,
              },
              services: supabaseSiteContent.services || getDefaultSiteContent().services,
              contact: {
                ...getDefaultSiteContent().contact,
                ...supabaseSiteContent.contact,
              },
              social: {
                ...getDefaultSiteContent().social,
                ...supabaseSiteContent.social,
              },
              siteSettings: {
                ...getDefaultSiteContent().siteSettings,
                ...supabaseSiteContent.siteSettings,
              },
            };
            setSiteContent(mergedContent);
          } else {
            // Eğer Supabase'de veri yoksa, varsayılan içeriği kullan ve kaydet
            const defaultContent = getDefaultSiteContent();
            setSiteContent(defaultContent);
            await supabaseService.saveSiteContent(defaultContent);
          }
        } catch (supabaseError) {
          console.warn('Supabase site içeriği yüklenemedi, localStorage kullanılıyor:', supabaseError);
          // Supabase hatası durumunda localStorage'ı fallback olarak kullan
          const savedContent = localStorage.getItem("siteContent");
          if (savedContent) {
            const parsedContent = JSON.parse(savedContent);
            const mergedContent = {
              ...getDefaultSiteContent(),
              ...parsedContent,
              header: {
                ...getDefaultSiteContent().header,
                ...parsedContent.header,
              },
              services: parsedContent.services || getDefaultSiteContent().services,
              contact: {
                ...getDefaultSiteContent().contact,
                ...parsedContent.contact,
              },
              social: {
                ...getDefaultSiteContent().social,
                ...parsedContent.social,
              },
              siteSettings: {
                ...getDefaultSiteContent().siteSettings,
                ...parsedContent.siteSettings,
              },
            };
            setSiteContent(mergedContent);
          } else {
            const defaultContent = getDefaultSiteContent();
            setSiteContent(defaultContent);
            localStorage.setItem("siteContent", JSON.stringify(defaultContent));
          }
        }

      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Real-time subscriptions
    const projectsSubscription = supabaseService.subscribeToProjects((payload) => {
      console.log('Projects updated in admin:', payload);
      // Reload projects when there's a change
      loadData();
    });

    const siteContentSubscription = supabaseService.subscribeToSiteContent((payload) => {
      console.log('Site content updated in admin:', payload);
      if (payload.new && payload.new.content) {
        setSiteContent(payload.new.content);
      }
    });

    const formSubmissionsSubscription = supabaseService.subscribeToFormSubmissions((payload) => {
      console.log('Form submissions updated:', payload);
      // Reload data to get updated form submissions
      loadData();
    });

    // Cleanup subscriptions on unmount
    return () => {
       supabaseService.unsubscribe(projectsSubscription);
       supabaseService.unsubscribe(siteContentSubscription);
       supabaseService.unsubscribe(formSubmissionsSubscription);
     };
   }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  const saveProjectsToStorage = async (updatedProjects) => {
    try {
      // Önce state'i güncelle
      setProjects(updatedProjects);
      
      // Supabase'e kaydet
      await supabaseService.saveProjects(updatedProjects);
      
      // Fallback olarak localStorage'a da kaydet
      localStorage.setItem("adminProjects", JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Projeler kaydedilirken hata:', error);
      // Supabase hatası durumunda sadece localStorage'a kaydet
      localStorage.setItem("adminProjects", JSON.stringify(updatedProjects));
      alert('Projeler kaydedilirken bir hata oluştu, ancak yerel olarak kaydedildi.');
    }
  };

  const saveSiteContentToStorage = async (updatedContent) => {
    try {
      // Önce state'i güncelle
      setSiteContent(updatedContent);
      
      // Supabase'e kaydet
      await supabaseService.saveSiteContent(updatedContent);
      
      // Fallback olarak localStorage'a da kaydet
      localStorage.setItem("siteContent", JSON.stringify(updatedContent));
    } catch (error) {
      console.error('Site içeriği kaydedilirken hata:', error);
      // Supabase hatası durumunda sadece localStorage'a kaydet
      localStorage.setItem("siteContent", JSON.stringify(updatedContent));
      alert('Site içeriği kaydedilirken bir hata oluştu, ancak yerel olarak kaydedildi.');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
  };

  const handleSaveEdit = async () => {
    const updatedProjects = projects.map((p) =>
      p.id === editingProject.id ? editingProject : p
    );
    await saveProjectsToStorage(updatedProjects);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      const updatedProjects = projects.filter((p) => p.id !== id);
      await saveProjectsToStorage(updatedProjects);
    }
  };

  const handleAddProject = async () => {
    if (newProject.title && newProject.imageUrl && newProject.demoUrl) {
      const newId = Math.max(...projects.map((p) => p.id)) + 1;
      const projectToAdd = {
        ...newProject,
        id: newId,
      };
      const updatedProjects = [...projects, projectToAdd];
      await saveProjectsToStorage(updatedProjects);
      setNewProject({ title: "", imageUrl: "", demoUrl: "" });
      setShowAddForm(false);
    }
  };

  // Hizmet yönetimi fonksiyonları
  const handleEditService = (index) => {
    setEditingService({ ...siteContent.services[index], index });
  };

  const handleSaveServiceEdit = async () => {
    const updatedServices = [...siteContent.services];
    updatedServices[editingService.index] = {
      title: editingService.title,
      image: editingService.image,
    };
    const updatedContent = {
      ...siteContent,
      services: updatedServices,
    };
    await saveSiteContentToStorage(updatedContent);
    setEditingService(null);
  };

  const handleDeleteService = async (index) => {
    if (window.confirm("Bu hizmeti silmek istediğinizden emin misiniz?")) {
      const updatedServices = siteContent.services.filter(
        (_, i) => i !== index
      );
      const updatedContent = {
        ...siteContent,
        services: updatedServices,
      };
      await saveSiteContentToStorage(updatedContent);
    }
  };

  const handleAddService = async () => {
    if (newService.title && newService.image) {
      const updatedServices = [...siteContent.services, newService];
      const updatedContent = {
        ...siteContent,
        services: updatedServices,
      };
      await saveSiteContentToStorage(updatedContent);
      setNewService({ title: "", image: "" });
      setShowAddServiceForm(false);
    }
  };

  const handleSaveHeader = async () => {
    await saveSiteContentToStorage(siteContent);
    alert("Header bilgileri kaydedildi!");
  };

  const handleSaveSocial = async () => {
    await saveSiteContentToStorage(siteContent);
    alert("Sosyal medya linkleri kaydedildi!");
  };

  const handleSaveSettings = async () => {
    await saveSiteContentToStorage(siteContent);
    alert("Site ayarları kaydedildi!");
  };

  // Yetenek yönetimi fonksiyonları
  const handleEditSkill = (index) => {
    const skills = siteContent.header?.skills || [];
    if (skills[index]) {
      setEditingSkill({ ...skills[index], index });
    }
  };

  const handleSaveSkillEdit = async () => {
    const currentSkills = siteContent.header?.skills || [];
    const updatedSkills = [...currentSkills];
    updatedSkills[editingSkill.index] = {
      name: editingSkill.name,
      icon: editingSkill.icon,
    };
    const updatedContent = {
      ...siteContent,
      header: {
        ...siteContent.header,
        skills: updatedSkills,
      },
    };
    await saveSiteContentToStorage(updatedContent);
    setEditingSkill(null);
  };

  const handleDeleteSkill = async (index) => {
    if (window.confirm("Bu yeteneği silmek istediğinizden emin misiniz?")) {
      const currentSkills = siteContent.header?.skills || [];
      const updatedSkills = currentSkills.filter((_, i) => i !== index);
      const updatedContent = {
        ...siteContent,
        header: {
          ...siteContent.header,
          skills: updatedSkills,
        },
      };
      await saveSiteContentToStorage(updatedContent);
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.name && newSkill.icon) {
      const currentSkills = siteContent.header?.skills || [];
      const updatedSkills = [...currentSkills, newSkill];
      const updatedContent = {
        ...siteContent,
        header: {
          ...siteContent.header,
          skills: updatedSkills,
        },
      };
      await saveSiteContentToStorage(updatedContent);
      setNewSkill({ name: "", icon: "" });
      setShowAddSkillForm(false);
    }
  };

  // Animasyonlu başlık yönetimi
  const handleAddAnimatedTitle = async () => {
    if (newAnimatedTitle.trim()) {
      const currentTitles = siteContent.header?.animatedTitles || [];
      const updatedTitles = [...currentTitles, newAnimatedTitle.trim()];
      const updatedContent = {
        ...siteContent,
        header: {
          ...siteContent.header,
          animatedTitles: updatedTitles,
        },
      };
      await saveSiteContentToStorage(updatedContent);
      setNewAnimatedTitle("");
    }
  };

  const handleDeleteAnimatedTitle = async (index) => {
    const currentTitles = siteContent.header?.animatedTitles || [];
    if (currentTitles.length > 1) {
      const updatedTitles = currentTitles.filter((_, i) => i !== index);
      const updatedContent = {
        ...siteContent,
        header: {
          ...siteContent.header,
          animatedTitles: updatedTitles,
        },
      };
      await saveSiteContentToStorage(updatedContent);
    } else {
      alert("En az bir animasyonlu başlık bulunmalıdır!");
    }
  };

  const renderProjectsTab = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Proje Yönetimi</h2>
        <button className="add-button" onClick={() => setShowAddForm(true)}>
          <FaPlus /> Yeni Proje Ekle
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <h3>Yeni Proje Ekle</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Proje Başlığı"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Resim URL'si"
              value={newProject.imageUrl}
              onChange={(e) =>
                setNewProject({ ...newProject, imageUrl: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Demo URL'si"
              value={newProject.demoUrl}
              onChange={(e) =>
                setNewProject({ ...newProject, demoUrl: e.target.value })
              }
            />
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleAddProject}>
              <FaSave /> Kaydet
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowAddForm(false)}>
              <FaTimes /> İptal
            </button>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card-admin">
            {editingProject && editingProject.id === project.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editingProject.imageUrl}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editingProject.demoUrl}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      demoUrl: e.target.value,
                    })
                  }
                />
                <div className="edit-actions">
                  <button className="save-button" onClick={handleSaveEdit}>
                    <FaSave /> Kaydet
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditingProject(null)}>
                    <FaTimes /> İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img src={project.imageUrl} alt={project.title} />
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer">
                    Demo Linki
                  </a>
                  <div className="project-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditProject(project)}>
                      <FaEdit /> Düzenle
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProject(project.id)}>
                      <FaTrash /> Sil
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeaderTab = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Header Yönetimi</h2>
      </div>
      <div className="settings-grid">
        <div className="setting-item">
          <h3>İsim</h3>
          <input
            type="text"
            value={siteContent.header?.name || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                header: { ...siteContent.header, name: e.target.value },
              })
            }
          />
        </div>
        <div className="setting-item">
          <h3>Ana Başlık</h3>
          <input
            type="text"
            value={siteContent.header?.title || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                header: { ...siteContent.header, title: e.target.value },
              })
            }
          />
        </div>

        {/* Animasyonlu Başlıklar */}
        <div className="setting-item">
          <h3>Animasyonlu Başlıklar</h3>
          <div className="animated-titles-list">
            {(siteContent.header?.animatedTitles || []).map((title, index) => (
              <div key={index} className="animated-title-item">
                <span>{title}</span>
                <button
                  onClick={() => handleDeleteAnimatedTitle(index)}
                  className="delete-button"
                  disabled={
                    (siteContent.header?.animatedTitles || []).length === 1
                  }>
                  <FaTrash /> Sil
                </button>
              </div>
            ))}
          </div>
          <div className="add-animated-title">
            <input
              type="text"
              value={newAnimatedTitle}
              onChange={(e) => setNewAnimatedTitle(e.target.value)}
              placeholder="Yeni animasyonlu başlık"
            />
            <button onClick={handleAddAnimatedTitle} className="add-button">
              <FaPlus /> Ekle
            </button>
          </div>
        </div>

        {/* Yetenekler */}
        <div className="setting-item">
          <h3>Yetenekler</h3>
          <div className="skills-grid">
            {(siteContent.header?.skills || []).map((skill, index) => (
              <div key={index} className="skill-card-admin">
                {editingSkill && editingSkill.index === index ? (
                  <div className="skill-edit-form">
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          name: e.target.value,
                        })
                      }
                      placeholder="Yetenek adı"
                    />
                    <input
                      type="text"
                      value={editingSkill.icon}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          icon: e.target.value,
                        })
                      }
                      placeholder="İkon adı (örn: FaHtml5)"
                    />
                    <div className="skill-actions">
                      <button
                        onClick={handleSaveSkillEdit}
                        className="save-button">
                        <FaSave /> Kaydet
                      </button>
                      <button
                        onClick={() => setEditingSkill(null)}
                        className="cancel-button">
                        <FaTimes /> İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="skill-info">
                    <h4>{skill.name}</h4>
                    <p>İkon: {skill.icon}</p>
                    <div className="skill-actions">
                      <button
                        onClick={() => handleEditSkill(index)}
                        className="edit-button">
                        <FaEdit /> Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(index)}
                        className="delete-button">
                        <FaTrash /> Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showAddSkillForm ? (
            <div className="add-skill-form">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="Yetenek adı"
              />
              <input
                type="text"
                value={newSkill.icon}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, icon: e.target.value })
                }
                placeholder="İkon adı (örn: FaHtml5)"
              />
              <div className="form-actions">
                <button onClick={handleAddSkill} className="save-button">
                  <FaSave /> Ekle
                </button>
                <button
                  onClick={() => setShowAddSkillForm(false)}
                  className="cancel-button">
                  <FaTimes /> İptal
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddSkillForm(true)}
              className="add-button">
              <FaPlus /> Yeni Yetenek Ekle
            </button>
          )}
        </div>

        <div className="setting-item">
          <h3>Açıklama</h3>
          <textarea
            value={siteContent.header?.description || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                header: { ...siteContent.header, description: e.target.value },
              })
            }
            rows="6"
          />
        </div>
        <div className="setting-item">
          <h3>Profil Resmi URL</h3>
          <input
            type="text"
            value={siteContent.header?.profileImage || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                header: { ...siteContent.header, profileImage: e.target.value },
              })
            }
          />
        </div>
      </div>
      <button className="save-settings-button" onClick={handleSaveHeader}>
        <FaSave /> Header Bilgilerini Kaydet
      </button>
    </div>
  );

  const renderServicesTab = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Hizmet Yönetimi</h2>
        <button
          className="add-button"
          onClick={() => setShowAddServiceForm(true)}>
          <FaPlus /> Yeni Hizmet Ekle
        </button>
      </div>

      {showAddServiceForm && (
        <div className="add-form">
          <h3>Yeni Hizmet Ekle</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Hizmet Başlığı"
              value={newService.title}
              onChange={(e) =>
                setNewService({ ...newService, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Resim URL'si"
              value={newService.image}
              onChange={(e) =>
                setNewService({ ...newService, image: e.target.value })
              }
            />
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleAddService}>
              <FaSave /> Kaydet
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowAddServiceForm(false)}>
              <FaTimes /> İptal
            </button>
          </div>
        </div>
      )}

      <div className="services-grid">
        {(siteContent.services || []).map((service, index) => (
          <div key={index} className="service-card-admin">
            {editingService && editingService.index === index ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      title: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editingService.image}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      image: e.target.value,
                    })
                  }
                />
                <div className="edit-actions">
                  <button
                    className="save-button"
                    onClick={handleSaveServiceEdit}>
                    <FaSave /> Kaydet
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditingService(null)}>
                    <FaTimes /> İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={process.env.PUBLIC_URL + service.image}
                  alt={service.title}
                />
                <div className="service-info">
                  <h3>{service.title}</h3>
                  <div className="service-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditService(index)}>
                      <FaEdit /> Düzenle
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteService(index)}>
                      <FaTrash /> Sil
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Form Gönderileri</h2>
      </div>

      {/* Form Gönderileri */}
      <div className="form-submissions-section">
        <h3>
          Toplam Form Gönderimi: (
          {(siteContent.contact?.formSubmissions || []).length})
        </h3>
        {(siteContent.contact?.formSubmissions || []).length === 0 ? (
          <p className="no-submissions">Henüz form gönderimi bulunmuyor.</p>
        ) : (
          <div className="submissions-list">
            {(siteContent.contact?.formSubmissions || []).map(
              (submission, index) => (
                <div key={index} className="submission-card">
                  <div className="submission-header">
                    <h5>{submission.name}</h5>
                    <span className="submission-date">{submission.date}</span>
                  </div>
                  <div className="submission-details">
                    <p>
                      <strong>E-posta:</strong> {submission.email}
                    </p>
                    <p>
                      <strong>Telefon:</strong>{" "}
                      {submission.phone || "Belirtilmemiş"}
                    </p>
                    <p>
                      <strong>Mesaj:</strong>
                    </p>
                    <div className="submission-message">
                      {submission.message}
                    </div>
                  </div>
                  <div className="submission-actions">
                    <button
                      onClick={() => {
                        const updatedSubmissions = (
                          siteContent.contact?.formSubmissions || []
                        ).filter((_, i) => i !== index);
                        const updatedContent = {
                          ...siteContent,
                          contact: {
                            ...siteContent.contact,
                            formSubmissions: updatedSubmissions,
                          },
                        };
                        saveSiteContentToStorage(updatedContent);
                      }}
                      className="delete-button">
                      <FaTrash /> Sil
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Sosyal Medya Yönetimi</h2>
      </div>
      <div className="settings-grid">
        <div className="setting-item">
          <h3>LinkedIn URL</h3>
          <input
            type="text"
            value={siteContent.social?.linkedin || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                social: { ...siteContent.social, linkedin: e.target.value },
              })
            }
          />
        </div>
        <div className="setting-item">
          <h3>GitHub URL</h3>
          <input
            type="text"
            value={siteContent.social?.github || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                social: { ...siteContent.social, github: e.target.value },
              })
            }
          />
        </div>
        <div className="setting-item">
          <h3>E-posta</h3>
          <input
            type="email"
            value={siteContent.social?.email || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                social: { ...siteContent.social, email: e.target.value },
              })
            }
          />
        </div>
      </div>
      <button className="save-settings-button" onClick={handleSaveSocial}>
        <FaSave /> Sosyal Medya Linklerini Kaydet
      </button>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Site Ayarları</h2>
      </div>
      <div className="settings-grid">
        <div className="setting-item">
          <h3>Site Başlığı</h3>
          <input
            type="text"
            value={siteContent.siteSettings?.title || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                siteSettings: {
                  ...siteContent.siteSettings,
                  title: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="setting-item">
          <h3>Meta Açıklama</h3>
          <textarea
            value={siteContent.siteSettings?.description || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                siteSettings: {
                  ...siteContent.siteSettings,
                  description: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="setting-item">
          <h3>Anahtar Kelimeler</h3>
          <input
            type="text"
            value={siteContent.siteSettings?.keywords || ""}
            onChange={(e) =>
              setSiteContent({
                ...siteContent,
                siteSettings: {
                  ...siteContent.siteSettings,
                  keywords: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <button className="save-settings-button" onClick={handleSaveSettings}>
        <FaSave /> Site Ayarlarını Kaydet
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-loading">
          <h2>Yükleniyor...</h2>
          <p>Veriler yükleniyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="admin-error">
          <h2>Hata</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Sayfayı Yenile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-user">
            <FaUser />
            <span>{localStorage.getItem("adminUser")}</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={activeTab === "header" ? "active" : ""}
            onClick={() => handleTabChange("header")}>
            <FaHome /> Header
          </button>
          <button
            className={activeTab === "services" ? "active" : ""}
            onClick={() => handleTabChange("services")}>
            <FaServicestack /> Hizmetler
          </button>
          <button
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => handleTabChange("projects")}>
            <FaProjectDiagram /> Projeler
          </button>
          <button
            className={activeTab === "contact" ? "active" : ""}
            onClick={() => handleTabChange("contact")}>
            <FaEnvelope /> İletişim
          </button>
          <button
            className={activeTab === "social" ? "active" : ""}
            onClick={() => handleTabChange("social")}>
            <FaShare /> Sosyal Medya
          </button>
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => handleTabChange("settings")}>
            <FaCog /> Site Ayarları
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </div>

      <div className="admin-main">
        {activeTab === "header" && renderHeaderTab()}
        {activeTab === "services" && renderServicesTab()}
        {activeTab === "projects" && renderProjectsTab()}
        {activeTab === "contact" && renderContactTab()}
        {activeTab === "social" && renderSocialTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </div>
    </div>
  );
};
  
export default AdminPanel;
