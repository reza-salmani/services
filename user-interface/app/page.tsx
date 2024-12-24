import LoginLayout from "./login/layout";
import Login from "./login/page";

export default function Home() {
  return (
    <div className="m-0 p-0">
      <LoginLayout>
        <Login></Login>
      </LoginLayout>
    </div>
  );
}
