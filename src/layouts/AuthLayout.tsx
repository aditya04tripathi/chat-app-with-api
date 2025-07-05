function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-4/5 h-4/5 border rounded flex flex-col md:flex-row items-center justify-center overflow-hidden">
        <img
          src="https://picsum.photos/1080"
          className="hidden md:block w-1/2 h-full object-cover"
        />

        <div className="w-full md:w-1/2">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
