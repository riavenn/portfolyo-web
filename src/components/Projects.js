import React from "react";
import "./Projects.css";

const projectsData = [
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
];

function Projects() {
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
