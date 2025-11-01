export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="text-blue-500">GDG FlashCard</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Master any subject with our interactive flashcard learning system.
            Create, study, and track your progress all in one place.
          </p>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto mt-12">
            <h2 className="text-2xl font-semibold mb-4">
              Get Started Today
            </h2>
            
            <p className="text-gray-400 mb-6">
              Sign up or sign in to start creating your personalized flashcard decks.
            </p>
            
            <p className="text-sm text-gray-500">
              Click the buttons in the header above to get started! 🔥
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
