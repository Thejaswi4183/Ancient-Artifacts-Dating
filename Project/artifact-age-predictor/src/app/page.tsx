import UploadForm from "@/components/uploadForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Artifact Age Predictor</h1>
      <UploadForm />
    </main>
  );
}
