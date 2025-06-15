
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Location, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Supabase 'users' table: id, name, email, password, role, location_id, created_at, status

export function useSupabaseUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load locations from localStorage (can be updated to Supabase if needed)
  useEffect(() => {
    const storedLocations = localStorage.getItem("medcontrol_locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  // Load all users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: error.message,
      });
      setUsers([]);
    } else {
      setUsers((data || []).map((u) => ({
        ...u,
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        healthUnit: "",
        role: u.role as UserRole,
        canApprove: false, // ajuste caso implemente permissões específicas
        locationId: u.location_id ?? "",
        createdAt: u.created_at,
        status: u.status ?? "active",
        phone: "", // se implementar no banco depois, troca por u.phone
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new user
  const handleAddUser = async (newUser: User) => {
    const { error } = await supabase.from("users").insert([{
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      location_id: newUser.locationId,
      created_at: new Date().toISOString(),
      status: newUser.status,
    }]);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error.message,
      });
    } else {
      toast({
        title: "Usuário criado",
        description: `${newUser.name} foi adicionado.`,
      });
      fetchUsers();
    }
  };

  // Update user
  const handleUpdateUser = async (updatedUser: User) => {
    const { error } = await supabase.from("users").update({
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      role: updatedUser.role,
      location_id: updatedUser.locationId,
      status: updatedUser.status,
    }).eq("id", updatedUser.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: error.message,
      });
    } else {
      toast({
        title: "Usuário atualizado",
        description: `${updatedUser.name} foi atualizado.`,
      });
      fetchUsers();
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase.from("users").delete().eq("id", userId);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error.message,
      });
    } else {
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido.",
      });
      fetchUsers();
    }
  };

  // Search & filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
    handleDeleteUser,
    loading,
    fetchUsers,
  };
}
