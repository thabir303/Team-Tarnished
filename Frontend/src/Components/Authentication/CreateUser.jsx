import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const CreateUser = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleAddVehicle = async (e) => {
    e.preventDefault();

    const form = e.target;

    const titleNumber = form.titleName.value;
    const ownerName = form.ownerName.value;
    const type = form.category.value;
    const imageUrl = form.vehicleImage.value;
    const description = form.description.value;

    try {
      const vehicle = { titleNumber, ownerName, type, description, imageUrl };

      console.log(vehicle);

      axiosSecure
        .post("http://loalhost:3000/api/v1/transport/add-transport", vehicle)
        .then((res) => {
          console.log(res.data.data);
          Swal.fire({
            title: "Vehicle add Successful!",
            text: "Enjoy Exploring!",
            icon: "success",
            confirmButtonText: "Continue",
          });
          navigate("/home/transportList");
        });
    } catch (error) {
      console.error("Error adding documents or vehicle:", error);
    }
  };
  return (
    <div className="pb-10">
      <div className="card bg-base-100 w-full mx-auto max-w-7xl shrink-0 shadow-2xl">
        <div className="text-center pt-10 pb-5">
          <h2 className="text-4xl font-bold ">Add New Vehicle</h2>
        </div>
        <form onSubmit={handleAddVehicle} className="px-10">
          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Title Name</span>
              </label>
              <input
                type="text"
                name="titleName"
                placeholder="vehicle title"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Owner Name</span>
              </label>
              <input
                type="text"
                name="ownerName"
                placeholder="owner name"
                className="input input-bordered"
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                required
                name="category"
                className="select select-bordered w-full "
              >
                <option disabled selected>
                  Select Category
                </option>
                <option>Truck</option>
                <option>Pickup</option>
                <option>Motorcycle</option>
              </select>
            </div>
            <div className="form-control w-1/2">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="text"
                name="vehicleImage"
                placeholder="image"
                className="input input-bordered"
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                name="description"
                placeholder="description"
                className="input input-bordered"
                required
              />
            </div>
          </div>

          <div className="form-control my-6">
            <button className="btn bg-[#FFD576]">Add vehicle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
