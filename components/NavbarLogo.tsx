import { Recycle } from 'lucide-react';

export default function NavbarLogo() {
  return (
    <div className="flex items-center gap-2 font-bold text-xl">
      <Recycle size={28} className="text-primary" />
      <span>EcoScrap</span>
    </div>
  );
}