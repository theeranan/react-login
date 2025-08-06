import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: inputs.email,
      password: inputs.password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // ตรวจสอบว่ามี token หรือไม่ ตามที่ API ส่งกลับมา
        if (result.token != "") {
          localStorage.setItem("token", result.token);
          alert("ล็อกอินสำเร็จ");
          navigate("/profile");
        } else {
          //  result.message คือข้อความที่ API ส่งกลับมา statusCode 400
          // ที่ใช้แบบไม่ต้องมีเงื่อนไข statusCode 400 ได้เพราะว่า API จะไม่ส่ง token กลับมา ถ้าไม่สำเร็จ
          alert("ล็อกอินไม่สำเร็จ " + result.message);
          // MySwal.fire({
          //   html: <i>{result.message}</i>,
          //   icon: "error",
          // });
        }
      })

      .catch((error) => console.error(error));

    console.log(inputs);
  };

  // JSX ต้องอยู่ภายในฟังก์ชันเท่านั้น
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          email:
          <input
            type="text"
            name="email"
            value={inputs.email || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
          />
        </label>

        <input type="submit" />
      </form>
    </div>
  );
}

export default Login;
