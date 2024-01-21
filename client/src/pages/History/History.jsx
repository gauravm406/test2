import { useState, useEffect, useContext } from "react";
import { Context } from "../../App.jsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import Masonry from "react-masonry-css";
import axios from "axios";
import styles from "./History.module.css";
import { toast } from "react-toastify";

const History = () => {
  const { user } = useContext(Context);
  const API_KEY = import.meta.env.VITE_REACT_API_KEY;
  const userId = user?.uid;

  const [ids, setIds] = useState(null);
  const [images, setImages] = useState(null);
  const [hasLoading, setHasLoading] = useState(false);

  // number of columns according to screen size
  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1100: 2, // Number of columns on screen sizes between 1100px and 700px
    700: 1, // Number of columns on screen sizes between 700px and 500px
    500: 1, // Number of columns on screen sizes below 500px
  };

  // fethc ids of favourite images
  const fetchIds = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "downloaded"), where("userId", "==", userId))
      );

      const filteredData = querySnapshot.docs.map((doc) => doc.data());

      let tempIds = filteredData.map((ele) => ele.imageId);

      setIds([...tempIds]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchImageData = async (id) => {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&id=${id}&image_type=photo&per_page=200&pretty=true`
    );

    return response.data;
  };

  const fetchAllImages = async () => {
    try {
      setHasLoading(true);
      const response = await ids.map((id) => fetchImageData(id));
      const data = await Promise.all(response);
      const tempData = data.map((ele) => ele.hits[0]);
      setImages(tempData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setHasLoading(false);
    }
  };

  // fetch ids of downloaded images from firebase
  useEffect(() => {
    if (user) {
      fetchIds();
    }
  }, [user]);

  // fetch downloaded images
  useEffect(() => {
    if (ids) {
      fetchAllImages();
    }
  }, [ids]);

  return hasLoading ? (
    <div className={styles.loader}>
      <span className="loader"></span>
    </div>
  ) : (
    <main className={styles.main_container}>
      {images?.length <= 0 ? (
        <h2>No Dowloaded Images</h2>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.images_container}
          columnClassName={styles.masonry_grid_column}
        >
          {images?.map((ele, index) => (
            <div key={index} className={styles.img_card}>
              <img src={ele.largeImageURL} alt={ele.tags} />
            </div>
          ))}
        </Masonry>
      )}
    </main>
  );
};

export default History;
