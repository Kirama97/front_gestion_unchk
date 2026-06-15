import { useParams } from "react-router-dom";

const cours = {
  id: 1,
  sequences: [
    {
      id: 1,
      titre: "Introduction",
      contenu: "Bienvenue dans le cours d'algorithme avancée.",
    },
    {
      id: 2,
      titre: "Les arbres binaires",
      contenu: "Cette séquence présente les arbres binaires.",
    },
    {
      id: 3,
      titre: "Les graphes",
      contenu: "Cette séquence explique les graphes.",
    },
  ],
};

export default function DetailSequence() {
  const { sequenceId } = useParams();

  const sequence = cours.sequences.find(
    (seq) => seq.id === Number(sequenceId)
  );

  if (!sequence) {
    return <h2>Séquence introuvable.</h2>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{sequence.titre}</h1>

      <p className="mt-4 text-gray-600">
        {sequence.contenu}
      </p>
    </div>
  );
}