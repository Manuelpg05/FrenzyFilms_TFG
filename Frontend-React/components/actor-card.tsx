type Actor = {
  id: string
  name: string
  character: string
  photo: string
}

export default function ActorCard({ actor }: { actor: Actor }) {
  return (
    <div className="w-36 sm:w-44 md:w-44 lg:w-48 xl:w-60 bg-gray-900 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-red-600/20 hover:shadow-lg">
      <img
        src={actor.photo || "/placeholder.svg"}
        alt={actor.name}
        className="w-full aspect-[2/3] object-cover object-top rounded-t-lg"
      />
      <div className="p-3">
        <h3 className="font-bold text-white text-sm">{actor.name}</h3>
        <p className="text-gray-400 text-xs">{actor.character}</p>
      </div>
    </div>
  )
}
