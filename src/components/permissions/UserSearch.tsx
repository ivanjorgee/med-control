
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-72">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar usuário..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;
