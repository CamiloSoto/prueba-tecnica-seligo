import Navbar from "../../components/Navbar";
import SalesUploaderFormik from "../../components/SalesUploaderFormik";

const UploadPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row mt-4">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-body">
                <SalesUploaderFormik />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
