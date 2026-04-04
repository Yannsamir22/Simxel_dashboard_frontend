import type React from "react";

interface LoadingProps {
  message: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-100">
      <span className="loading loading-bars loading-lg text-primary"></span>
      <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">
        {message}
      </p>
    </div>
  );
};

export default Loading;
