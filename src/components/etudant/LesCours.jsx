import React from 'react'
import CardCours from './CardCours';

const LesCours = () => {

   const cours = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    titre: "Introduction à HTML & CSS",
    description:
      "Apprenez à créer des pages web modernes avec HTML5 et CSS3.",
    tuteur: "Mouhamed Ndiaye",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    titre: "JavaScript pour débutants",
    description:
      "Découvrez les bases de JavaScript et rendez vos sites web interactifs.",
    tuteur: "Aminata Sow",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    titre: "Développement React",
    description:
      "Créez des interfaces utilisateur modernes avec React et les Hooks.",
    tuteur: "Cheikh Fall",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    titre: "Node.js & Express",
    description:
      "Développez des API REST performantes avec Node.js et Express.",
    tuteur: "Fatou Diop",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800",
    titre: "Bases de données MySQL",
    description:
      "Maîtrisez les requêtes SQL et la conception de bases de données relationnelles.",
    tuteur: "Ibrahima Ba",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    titre: "Spring Boot avec Java",
    description:
      "Développez des applications backend robustes avec Spring Boot.",
    tuteur: "Khadija Fall",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    titre: "Git & GitHub",
    description:
      "Apprenez à gérer les versions de vos projets et collaborer efficacement.",
    tuteur: "Ousmane Diallo",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    titre: "Cybersécurité : les fondamentaux",
    description:
      "Comprenez les bonnes pratiques pour sécuriser vos applications et vos données.",
    tuteur: "Mariama Cissé",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    titre: "Python pour la Data Science",
    description:
      "Manipulez des données et créez vos premiers scripts d'analyse avec Python.",
    tuteur: "Abdoulaye Sy",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800",
    titre: "Docker et la conteneurisation",
    description:
      "Déployez et exécutez vos applications dans des conteneurs Docker.",
    tuteur: "Sokhna Mbengue",
  },
];

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
        {cours.map((coursItem) => (
           <CardCours  coursItem={coursItem} />
        ))}
</div>
  )
}

export default LesCours
