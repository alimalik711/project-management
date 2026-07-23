function StatsCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition duration-300">

            <p className="text-gray-500 text-sm font-medium uppercase">
                {title}
            </p>

            <h2 className="text-4xl font-bold text-gray-800 mt-3">
                {value}
            </h2>

        </div>
    );
}

export default StatsCard;