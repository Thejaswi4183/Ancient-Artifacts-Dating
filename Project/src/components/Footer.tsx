import { FaDiscord, FaGithub, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Artifact Age Predictor. All rights reserved.</p>
      <div className="social-icons">
        <a href="https://discord.com/users/586373273160253453" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <FaDiscord />
        </a>
        <a href="https://github.com/Thejaswi4183" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://www.youtube.com/@DefinitelyNotVoid" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <FaYoutube />
        </a>
      </div>
    </footer>
  );
}
