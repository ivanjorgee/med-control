import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseUsers } from "@/hooks/use-supabase-users";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilter } from "@/components/users/UsersFilter";
import { UsersTable } from "@/components/users/UsersTable";

const UsersPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    roleFilter, 
    setRoleFilter,
    locations,
    filteredUsers,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    loading,
  } = useSupabaseUsers();
  
  return (
    <MainLayout>
      <UsersHeader onUserCreated={handleAddUser} />
      <UsersFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />
      <Card>
        <CardContent className="p-0">
          <UsersTable 
            users={filteredUsers} 
            locations={locations}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default UsersPage;
