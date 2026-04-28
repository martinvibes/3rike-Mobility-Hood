import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Lock, 
  Key, 
  Snowflake, 
  MessageCircle, 
  X, 
  Info, 
  ChevronRight, 
} from "lucide-react";

export default function SettingsHome() {
    const navigate = useNavigate();

    // Helper component for individual menu items
    const MenuItem = ({ icon: Icon, label, onClick }: any) => (
        <div 
            onClick={onClick} 
            className="flex items-center justify-between p-3 cursor-pointer active:bg-green-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#01C259]" strokeWidth={2} />
                <span className="text-gray-500 font-light text-sm">{label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
    );

    // Helper for the grouped rounded containers
    const MenuGroup = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-[#E6F6E94D] rounded-xl overflow-hidden mb-8">
            {children}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-white flex flex-col h-full">
            
            {/* --- Header --- */}
            <div className="relative flex items-center justify-center pt-12 pb-6 px-6 bg-white shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="absolute left-6 w-10 h-10 rounded-full bg-[#F3F8F5] hover:bg-green-50 text-[#01C259]"
                >
                    <img src="/rounded-back.svg" alt="Back" className="w-10 h-10" />
                </Button>
                
                <h1 className="font-semibold text-sm text-black">
                    Settings
                </h1>
            </div>

            {/* --- Scrollable Content --- */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 mt-5">
                
                {/* Group 1: Profile & Security */}
                <MenuGroup>
                    <MenuItem 
                        icon={User} 
                        label="My Profile" 
                        onClick={() => navigate("/driver/settings/profile")} 
                    />
                    <MenuItem 
                        icon={Lock} 
                        label="Payment Settings" 
                        onClick={() => navigate("/driver/settings/payment")} 
                    />
                    <MenuItem 
                        icon={Key} 
                        label="Login Settings" 
                        onClick={() => {}} 
                        showBorder={false}
                    />
                </MenuGroup>

                {/* Group 2: Account Actions */}
                <MenuGroup>
                    <MenuItem 
                        icon={Snowflake} 
                        label="Freeze account" 
                        onClick={() => {}} 
                    />
                    <MenuItem 
                        icon={MessageCircle} 
                        label="SMS Alert Settings" 
                        onClick={() => {}} 
                        showBorder={false}
                    />
                </MenuGroup>

                {/* Group 3: Close Account */}
                <MenuGroup>
                    <MenuItem 
                        icon={X} 
                        label="Close account" 
                        onClick={() => {}} 
                        showBorder={false}
                    />
                </MenuGroup>

                {/* Group 4: About */}
                <MenuGroup>
                    <MenuItem 
                        icon={Info} 
                        label="About" 
                        onClick={() => {}} 
                        showBorder={false}
                    />
                </MenuGroup>

            </div>

            {/* --- Footer Button --- */}
            <div className="absolute bottom-15 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm">
                <Button
                    className="w-full py-6 rounded-xl bg-[#01C259] hover:bg-[#01b050] text-white text-lg font-light shadow-md transition-all active:scale-[0.98]"
                >
                    Sign Out
                </Button>
            </div>

        </div>
    );
}