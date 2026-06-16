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
    <div className="w-full">
      <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{sequence.titre}</h1>
          <div className="flex items-center gap-2">
             <button className="px-2 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-black hover:text-white duration-200 transition ease-linear">Traveaux dirigé</button>
             <button className="px-2 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-black hover:text-white duration-200 transition ease-linear">Devoirs</button>
          </div>
      </div>
       

      {/* <p className="mt-4 text-gray-600">
        {sequence.contenu}
      </p> */}
    </div>
  );
}