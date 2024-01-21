import { useContext, useEffect, useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import home from "./home.module.css";
import { toast } from "react-toastify";
import { auth } from "../../firebase.js";
import { Context } from "../../App.jsx";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Grid from "../../components/Grid/Grid";
import { signOut } from "firebase/auth";

const Home = () => {
  const { user } = useContext(Context);

  const [sampleTags, setSampleTags] = useState([
    "Digital",
    "Computer",
    "tech",
    "Netz",
    "Finance",
    "Marketing",
    "AI",
    "Science",
  ]);

  const [data, hasLoading, error] = useFetch();
  const [searchQuery, setSearchQuery] = useState("");
  const [keyword, setkeyword] = useState("");

  // go button search
  const fetchImages = () => {
    setkeyword(searchQuery);
    setSearchQuery("");
  };

  // generate random index
  const randomIndex = useMemo(() => {
    if (data) {
      return Math.floor(Math.random() * data.hits.length);
    }
  }, [data]);

  // logout function
  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }
  }, [error]);

  return hasLoading ? (
    <div className={home.loader}>
      <span className="loader"></span>
    </div>
  ) : (
    data && (
      <>
        <section
          className={
            keyword
              ? `${home.main} ${home.main_height}`
              : `${home.main} ${home.main_height_keyword_false}`
          }
        >
          {/* home backgorund image */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              height: "100%",
              width: "100%",
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.hits[randomIndex].largeImageURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <section className={home.cover}>
            {/* home header */}
            <div className={home.header}>
              <div className={home.header_container_1}></div>
              <div className={home.header_container_2}>
                <Link className={`${home.links} ${home.homepage}`}>
                  Homepage
                </Link>
                <div className={home.right_link_container}>
                  {user ? (
                    <>
                      <Link to="/favourite" className={home.links}>
                        Favourites
                      </Link>
                      <Link to="/history" className={home.links}>
                        History
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className={home.links}>
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className={`${home.links} ${home.link_box}`}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                  {user && (
                    <button
                      onClick={logout}
                      className={`${home.links} ${home.link_box} ${home.logout_bg_color}`}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* home title */}
            {!keyword && (
              <h2 className={home.cover_heading}>
                Discover over 2,000,000 free Stock Images
              </h2>
            )}

            <div>
              {/* home search box */}
              <div className={home.search_box}>
                <FaMagnifyingGlass className={home.search_box_icon} />|
                <input
                  type="text"
                  placeholder="Search"
                  className={home.search_box_input}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className={home.search_box_button}
                  onClick={fetchImages}
                >
                  Go
                </button>
              </div>

              {/* trending container */}
              {!keyword && (
                <div className={home.trending_container}>
                  <span>Trending:</span>
                  <span>{data.hits[randomIndex].tags}</span>
                </div>
              )}

              {keyword && (
                <h2 className={home.search_result_heading}>
                  Results: <span>{keyword}</span>
                </h2>
              )}
            </div>
          </section>
        </section>

        {/* tag container */}
        <section className={home.tags_main_container}>
          {sampleTags.map((tag, index) => {
            return (
              <div key={index} onClick={() => setkeyword(tag)}>
                {tag}
              </div>
            );
          })}
        </section>

        {/* image grid */}
        <section className={home.grid_conatainer}>
          {keyword.length > 1 && <Grid keyword={keyword} />}
        </section>
      </>
    )
  );
};

export default Home;
