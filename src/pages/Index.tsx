import Terminal from '../components/Terminal';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary animate-in fade-in slide-in-from-bottom duration-1000">
          Interactive Terminal
        </h1>
        <p className="text-center text-muted-foreground animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          A beautiful terminal experience right in your browser
        </p>
        <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Index;