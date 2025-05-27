
import { useState, useEffect } from "react";
import { User, Location } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedLocations = localStorage.getItem("medcontrol_locations");
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Handler functions for user operations
  const handleAddUser = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prevUsers) => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    toast({
      title: "Usuário atualizado",
      description: `${updatedUser.name} foi atualizado com sucesso.`
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido com sucesso."
    });
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    // Filter by search term
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by role
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return {
    searchTerm,
    setSearchTerm,
    roleFilter, 
    setRoleFilter,
    users,
    locations,
    filteredUsers,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser
  };
}
