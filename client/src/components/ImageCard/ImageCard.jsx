import React, { useState } from "react";
import styles from "./ImageCard.module.css";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { useContext } from "react";
import { Context } from "../../App";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

const ImageCard = ({ ele, handleImageCardClick }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const { user } = useContext(Context);

  const navigate = useNavigate();

  // saving user and image id to firebase
  const handleAddToFavourite = async () => {
    if (user) {
      try {
        const response = await addDoc(collection(db, "favourites"), {
          imageId: ele.id,
          userId: user.uid,
        });

        if (response) {
          setIsFavourite(true);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // if user is not logged in then navigate to login page
      navigate("/login");
    }
  };

  return (
    <div className={styles.img_card}>
      <div
        className={styles.masonry_grid_item}
        onClick={() => handleImageCardClick(ele)}
      >
        <img src={ele.largeImageURL} alt={ele.tags} loading="lazy" />
      </div>
      <div className={styles.tag_main}>
        <section className={styles.tags}>
          {/* indivisual image tags */}
          {ele.tags.split(",").map((tag, index) => (
            <span className={styles.tag_container} key={index}>
              {tag}
            </span>
          ))}
        </section>

        <section>
          <button
            className={
              !isFavourite
                ? `${styles.favourite_button}`
                : `${styles.favourite_button_red}`
            }
            onClick={() => handleAddToFavourite()}
          >
            {!isFavourite ? <IoMdHeartEmpty /> : <IoIosHeart />}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ImageCard;
