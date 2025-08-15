import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Home from "./Home";
function Profile() {
  const navigete = useNavigate();
  const MySwal = withReactContent(Swal);

  const [isLoaded, setIsLoaded] = useState(true);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    // api หน้านี้ยังไม่มีใน Server

    // ต้องทำ /api/auth/user เริ่มจากทำ flowchart ของหน้า profile ก่อน
    fetch("http://localhost:5000/api/auth/users", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "ok") {
          setUser(result.user);
          setIsLoaded(false);
        } else if (result.status === "forbidden") {
          MySwal.fire({
            html: <i>{result.message}</i>,
            icon: "error",
          }).then((valu) => {
            navigete("/");
          });
        }
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    navigete("/");
  };
  if (isLoaded) return <Home />;
  else {
    return (
      <div>
        <div>{user.id}</div>
        <div>{user.lname}</div>
        <div>{user.username}</div>
        <div>{user.email}</div>
        <div>
          <img src={user.avatar} alt={user.id} width={100} />
        </div>
        <div>
          <button onClick={logout}>logut</button>
        </div>
      </div>
    );
  }
}
export default Profile;
