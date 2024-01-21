import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Masonry from "react-masonry-css";
import grid from "./grid.module.css";
import Modal from "../Modal/Modal";
import ImageCard from "../ImageCard/ImageCard";

const Grid = ({ keyword }) => {
  const [data, hasLoading, error] = useFetch(keyword);
  const [selectedImage, setSelectedImage] = useState(null);

  // modal open or not
  const [isOpen, setIsOpen] = useState(false);

  const handleImageCardClick = (data) => {
    setIsOpen(true);
    setSelectedImage(data);
  };

  // number of columns according to screen size
  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1100: 2, // Number of columns on screen sizes between 1100px and 700px
    700: 1, // Number of columns on screen sizes between 700px and 500px
    500: 1, // Number of columns on screen sizes below 500px
  };

  return hasLoading ? (
    // loader
    <div className={grid.loader}>
      <span className="loader"></span>
    </div>
  ) : (
    // images grid using masonry layout
    <div className={grid.main_container}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={grid.images_container}
        columnClassName={grid.masonry_grid_column}
      >
        {data?.hits.map((ele, index) => (
          <div key={index} className={grid.img_card}>
            <ImageCard ele={ele} handleImageCardClick={handleImageCardClick} />
          </div>
        ))}
      </Masonry>

      {/* modal */}
      {isOpen && selectedImage && (
        <Modal setIsOpen={setIsOpen} imageData={selectedImage} />
      )}
    </div>
  );
};

export default Grid;
