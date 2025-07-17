import React, { useState, useEffect } from "react";
import "./Projects.css";
import { supabaseService } from "../lib/supabase";

const defaultProjectsData = [
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

function Projects() {
  const [projectsData, setProjectsData] = useState(defaultProjectsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // Önce Supabase'den projeleri yüklemeye çalış
        const supabaseProjects = await supabaseService.getProjects();

        if (supabaseProjects && supabaseProjects.length > 0) {
          // Convert Supabase format to component format
          const formattedProjects = supabaseProjects.map(project => ({
            id: project.project_id,
            title: project.title,
            imageUrl: project.image_url,
            demoUrl: project.demo_url
          }));
          setProjectsData(formattedProjects);
        } else {
          // Supabase'de veri yoksa localStorage'dan yükle
          const savedProjects = localStorage.getItem("adminProjects");
          if (savedProjects) {
            try {
              const parsedProjects = JSON.parse(savedProjects);
              setProjectsData(parsedProjects);
            } catch (error) {
              console.error(
                "localStorage'dan projeler yüklenirken hata:",
                error
              );
              setProjectsData(defaultProjectsData);
            }
          }
        }
      } catch (error) {
        console.error("Supabase'den projeler yüklenirken hata:", error);
        // Hata durumunda localStorage'a geri dön
        const savedProjects = localStorage.getItem("adminProjects");
        if (savedProjects) {
          try {
            const parsedProjects = JSON.parse(savedProjects);
            setProjectsData(parsedProjects);
          } catch (localError) {
            console.error(
              "localStorage'dan projeler yüklenirken hata:",
              localError
            );
            setProjectsData(defaultProjectsData);
          }
        } else {
          setProjectsData(defaultProjectsData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects();

    // Real-time subscription for projects updates
    const subscription = supabaseService.subscribeToProjects((payload) => {
      console.log('Projects updated:', payload);
      // Reload projects when there's a change
      loadProjects();
    });

    // Cleanup subscription on unmount
    return () => {
      supabaseService.unsubscribe(subscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="projects-container">
        <h2 className="projects-title">Projelerim</h2>
        <div className="projects-loading">
          <p>Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <h2 className="projects-title">Projelerim</h2>
      <div className="projects-grid">
        {projectsData.map((project) => (
          <div key={project.id} className="project-card">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="project-image"
            />
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-demo-link">
                Demoyu Gör
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
