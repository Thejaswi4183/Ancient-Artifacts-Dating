import UploadForm from "@/components/uploadForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white">
      <div className="bg-white/10 p-8 rounded-lg shadow-lg backdrop-blur-lg w-[90%] max-w-[600px]">
        <UploadForm />
      </div>
    </main>
  );
}
