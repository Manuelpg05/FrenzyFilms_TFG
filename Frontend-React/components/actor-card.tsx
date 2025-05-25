type Actor = {
  id: string
  name: string
  character: string
  photo: string
}

export default function ActorCard({ actor }: { actor: Actor }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-red-600/20 hover:shadow-lg">
      <img src={actor.photo || "/placeholder.svg"} alt={actor.name} className="w-full h-48 object-cover object-top" />
      <div className="p-3">
        <h3 className="font-bold text-white text-sm">{actor.name}</h3>
        <p className="text-gray-400 text-xs">{actor.character}</p>
      </div>
    </div>
  )
}
