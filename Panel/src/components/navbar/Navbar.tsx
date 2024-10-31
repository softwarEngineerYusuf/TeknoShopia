import { Button } from "@mui/material";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";

interface NavbarClosedProps {
  isMenuClosed: boolean;
  setIsMenuClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarClosedProps> = ({
  isMenuClosed,
  setIsMenuClosed,
}) => {
  return (
    <div className="flex justify-between items-center px-6 text-red-600 border-b-2 border-b-gray-400 py-7">
      <div className="flex">
        <div>
          <Button
            variant="contained"
            onClick={() => setIsMenuClosed(!isMenuClosed)}
          >
            <FormatAlignCenterIcon />
          </Button>
        </div>
        <div className="text-2xl ml-6">TeknoShopia</div>
      </div>
      <div className="text-2xl">Icons</div>
    </div>
  );
};

export default Navbar;
