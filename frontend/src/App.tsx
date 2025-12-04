function App() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">DaisyUI Buttons</h1>
      
      <button className="btn">Normal</button>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-secondary">Secondary</button>
      <button className="btn btn-accent">Accent</button>
      <button className="btn btn-success">Success</button>
      <button className="btn btn-error">Error</button>
      
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>If you see this styled - DaisyUI works! 🔥</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;