import styles from "./modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../../App";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

const Modal = ({ setIsOpen, imageData }) => {
  // tarcah image downloading
  const [hasDownloading, setHasDownloading] = useState(false);

  // contxt
  const { user } = useContext(Context);

  const navigate = useNavigate();

  // donwload image handler
  const handleDownload = async () => {
    if (user) {
      try {
        setHasDownloading(true);

        const response = await fetch(imageData.largeImageURL);
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement("a");
        // Set the href attribute to a URL created from the Blob
        link.href = URL.createObjectURL(blob);
        // Specify that the link should download the image
        link.download = `image_${imageData.id}.jpg`;

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        // Add the downloaded image information to Firestore
        const downloadedData = await addDoc(collection(db, "downloaded"), {
          imageId: imageData.id,
          userId: user.uid,
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setHasDownloading(false);
      }
    } else {
      // if user is not logged in then navigate to login page
      navigate("/login");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)}></div>
      <div className={styles.centered}>
        <div className={styles.modal}>
          <section className={styles.modalHeader}>
            <p>Preview ID: {imageData.id}</p>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
          </section>

          <section className={styles.imageInfo}>
            {/* image container */}
            <div>
              <img src={imageData.largeImageURL} />
            </div>

            {/* info container */}
            <div className={styles.infoContainer}>
              <h3>Download</h3>

              <section className={styles.size_select_container}>
                <div>
                  <span>Original:</span>
                  <span className={styles.logo_and_size}>
                    {imageData.imageWidth}x{imageData.imageHeight}
                    <span className={styles.logo}>
                      <FaCheckCircle size={16} />
                    </span>
                  </span>
                </div>
              </section>

              <button onClick={() => handleDownload()}>
                {hasDownloading ? "Downloading..." : "Download now"}
              </button>

              <h3>Information</h3>

              {/* analytics container */}
              <section className={styles.img_analytics}>
                <div>
                  <p>User</p>
                  <h4>{imageData.user}</h4>
                </div>
                <div>
                  <p>UserId</p>
                  <h4>{imageData.user_id}</h4>
                </div>
                <div>
                  <p>Type</p>
                  <h4>Photo</h4>
                </div>
                <div>
                  <p>Views</p>
                  <h4>{imageData.views}</h4>
                </div>
                <div>
                  <p>Downloads</p>
                  <h4>{imageData.downloads}</h4>
                </div>
                <div>
                  <p>Likes</p>
                  <h4>{imageData.likes}</h4>
                </div>
              </section>
            </div>
          </section>

          <section className={styles.tags_container}>
            Tags:
            {imageData.tags.split(",").map((tag, index) => {
              return <div key={index}>{tag}</div>;
            })}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Modal;
