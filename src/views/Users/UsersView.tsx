import { deleteUser, getUsers } from "@/apis/users.apis";
import type { PermissionsUserFormData, UserFormDataDelete, UserFormDataInfo } from "@/types/users.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Loader from "@/components/loader";
import { BadgeCheck, Ban, Ellipsis, Loader2, MessageCircleQuestion, Search, Trash, UserPenIcon, UserRoundCog } from "lucide-react";
import type { AuthPermissions } from "@/types/auth.interface";
import ToogleFieldsDialogUser from "@/components/users/ToogleFieldsDialogUser";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import CreateUser from "@/components/users/CreateUser";
import TableEmpty from "@/components/ui-components/TableEmpty";
import EditUser from "@/components/users/EditUser";
import type { ErrorData } from "@/types/errors.interface";
import { AlertDialog } from "@/components/ui/alert-dialog";
import AlertDialogDelete from "@/components/ui-components/AlertDialogDelete";
import AddOrEditPermissionsUser from "@/components/users/AddOrEditPermissionsUser";

export default function UsersView({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const modalEditUser = queryParams.get("editUser");
  const showEditModal = modalEditUser ? true : false;
  const modalPermissionsUser = queryParams.get("permissionsUser");
  const showPermissionsModal = modalPermissionsUser ? true : false;


  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteUser,
    onError: (error: ErrorData) => {
      toast.error(error.message, {
        position: "top-right",
        closeButton: true,
        action: {
          label: "Cerrar",
          onClick: () => toast.dismiss()
        }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success(data, {
        position: "top-right",
        closeButton: true,
        action: {
          label: "Cerrar  todas",
          onClick: () => toast.dismiss()
        }
      });
      setDeletedUser(null)
    }
  })

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [openDialogEditUser, setOpenDialogEditUser] = useState(showEditModal)
  const [openAlertDialogDelete, setOpenAlertDialogDelete] = useState(false);
  const [openDialogPermissionsUser, setOpenDialogPermissionsUser] = useState(showPermissionsModal)


  const [editingUser, setEditingUser] = useState<UserFormDataInfo | null>(null)
  const [deletedUser, setDeletedUser] = useState<UserFormDataDelete | null>(null)
  const [permissionsUser, setPermissionsUser] = useState<PermissionsUserFormData | null>(null)
  const [showFields, setShowFields] = useState<string[]>([
    "Nombre completo",
    "Cédula",
    "Celular",
    "Correo",
    "Tipo",
    "Estado",
    "Fecha creación",
    "Fecha modificación",
    "Usuario creador",
    "Usuario modificador"
  ]);

  const filteredUsers = Object.values(data || {}).filter(user =>
    Object.values(user).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isError) return <Navigate to={"/404"} />

  const handleChangeState = (state: boolean) => {
    if (state == true) {
      onClickDelete()
    }
  }


  const onClickDelete = () => {
    if (deletedUser != null) {
      mutate(deletedUser?.id);
    }
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      {
        isLoading ? (<Loader />) :
          (
            <div className="h-full flex flex-col items-center justify-center w-full px-4">
              <section className="h-[20%] md:h-[10%] w-full flex flex-col-reverse md:flex-row items-center justify-center gap-x-10">
                <div className="w-full md:w-[50%] border border-gray-400 py-1 px-2 mt-3 md:mt-0 rounded-lg flex items-center gap-x-1">
                  <Search className="size-5 text-gray-400" href="search" />
                  <input
                    id="search"
                    type="text"
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full border-none outline-none placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-4">
                  <Tooltip>
                    <TooltipTrigger className="w-full md:w-auto">
                      <button
                        className="w-full md:w-auto border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-x-4 py-1 px-4 font-medium text-base"
                        color="gray"
                        onClick={() => {
                          refetch();
                          toast.success("Datos actualizados correctamente...", {
                            position: "top-right",
                            closeButton: true,
                            action: {
                              label: "Cerrar",
                              onClick: () => toast.dismiss()
                            }
                          });
                        }}
                      >
                        <Loader2 className="size-5" />
                        <span className="md:hidden">Actualizar</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clic para actualizar la información</p>
                    </TooltipContent>
                  </Tooltip>

                  {
                    dataAuth?.permisos_usuario[0].guardar == 1 && (<CreateUser />)
                  }

                  <ToogleFieldsDialogUser showFields={showFields} setShowFields={setShowFields} />
                </div>
              </section>

              <div className="mt-3 w-full h-[80%] md:h-[90%] mx-auto">
                <Table>
                  <TableCaption>Registro de usuarios.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      {showFields.includes("Nombre completo") && <TableHead>Nombre</TableHead>}
                      {showFields.includes("Cédula") && <TableHead>Cédula</TableHead>}
                      {showFields.includes("Celular") && <TableHead>Celular</TableHead>}
                      {showFields.includes("Correo") && <TableHead>Correo</TableHead>}
                      {showFields.includes("Tipo") && <TableHead>Tipo</TableHead>}
                      {showFields.includes("Estado") && <TableHead>Estado</TableHead>}
                      {showFields.includes("Fecha creación") && <TableHead>Fecha creación</TableHead>}
                      {showFields.includes("Fecha modificación") && <TableHead>Fecha modificación</TableHead>}
                      {
                        dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                        showFields.includes("Usuario creador") && <TableHead>Usuario creador</TableHead>
                      }
                      {
                        dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                        showFields.includes("Usuario modificador") && <TableHead>Usuario modificador</TableHead>
                      }
                      {
                        dataAuth.tipo_usuario == import.meta.env.VITE_TYPEFROM_USER &&
                        showFields.includes("Usuario creador") &&
                        <TableHead className="text-right">Acción</TableHead>
                      }
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      filteredUsers?.map(user => (
                        <TableRow key={user.id}>
                          {
                            showFields.includes("id") &&
                            <TableCell>{user.id}</TableCell>
                          }
                          {
                            showFields.includes("Nombre completo") &&
                            <TableCell>{user.nombre_completo}</TableCell>
                          }
                          {
                            showFields.includes("Cédula") &&
                            <TableCell>{user.cedula}</TableCell>
                          }
                          {
                            showFields.includes("Celular") &&
                            <TableCell>{user.celular_usuario}</TableCell>
                          }
                          {
                            showFields.includes("Correo") &&
                            <TableCell>{user.correo_usuario}</TableCell>
                          }
                          {
                            showFields.includes("Tipo") &&
                            <TableCell>{user.tipo_usuario}</TableCell>
                          }
                          {
                            showFields.includes("Estado") &&
                            <TableCell>
                              <Badge variant={user.estado == 1 ? "secondary" : "destructive"}>
                                {user.estado == 1 ? (<BadgeCheck className="inline-start" />) : (<Ban className="inline-start" />)}
                                {user.estado == 1 ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                          }
                          {
                            showFields.includes("Fecha creación") &&
                            <TableCell>{user.fecha_creacion}</TableCell>
                          }
                          {
                            showFields.includes("Fecha modificación") &&
                            <TableCell>{user.fecha_modificacion}</TableCell>
                          }

                          {
                            showFields.includes("Usuario creador") &&
                            <TableCell>{user.nombre_completo_creador}</TableCell>
                          }

                          {
                            showFields.includes("Usuario modificador") &&
                            <TableCell>{user.nombre_usuario_modificador}</TableCell>
                          }

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                  <Ellipsis className="size-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>
                                    <Button
                                      onClick={() => {
                                        setEditingUser(user)
                                        setOpenDialogEditUser(!openDialogEditUser)
                                        refetch()

                                        if (openDialogEditUser) {
                                          navigate(location.pathname, { replace: true })
                                          setOpenDialogEditUser(!openDialogEditUser)
                                          refetch()
                                        }
                                        else {
                                          navigate(location.pathname + `?editUser=${user.id}`)
                                          refetch()
                                        }
                                      }}
                                      variant="outline"
                                      className="flex items-center justify-center gap-x-3"
                                    >
                                      <UserPenIcon className="size-4" />
                                      Modificar usuario
                                    </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Button
                                      onClick={() => {
                                        setPermissionsUser(permissionsUser)
                                        setOpenDialogPermissionsUser(!openDialogPermissionsUser)
                                        refetch()

                                        if (openDialogPermissionsUser) {
                                          navigate(location.pathname, { replace: true })
                                          setOpenDialogPermissionsUser(!openDialogPermissionsUser)
                                          refetch()
                                        }
                                        else {
                                          navigate(location.pathname + `?permissionsUser=${user.id}`)
                                          refetch()
                                        }
                                      }}
                                      variant="outline"
                                      className="flex items-center justify-center gap-x-3"
                                    >
                                      <UserRoundCog className="size-4" />
                                      Asignar permisos
                                    </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDeletedUser(user)
                                      setOpenAlertDialogDelete(true);
                                    }}
                                  >
                                    <Button
                                      variant="destructive"
                                    >
                                      <Trash className="size-4" />
                                      Eliminar usuario
                                    </Button>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    }

                    <TableRow>
                      {
                        filteredUsers.length == 0 &&
                        (
                          <TableCell colSpan={8}>
                            <div className="flex items-center flex-col justify-center">
                              <TableEmpty />
                              <p className='text-center font-bold text-3xl'>No se encontraron resultados...</p>
                            </div>
                          </TableCell>
                        )
                      }
                    </TableRow>

                    {
                      editingUser && (
                        <EditUser user={{ ...editingUser, usuario_modificador: "" }} onClose={() => setEditingUser(null)} />
                      )
                    }

                    {
                      openDialogPermissionsUser && (
                        <AddOrEditPermissionsUser onClose={() => setPermissionsUser(null)} />
                      )
                    }

                    {
                      (deletedUser != null || deletedUser != undefined) && (
                        <AlertDialog open={openAlertDialogDelete} onOpenChange={() => setDeletedUser(null)}>
                          <AlertDialogDelete
                            icon={MessageCircleQuestion}
                            title="Eliminar usuario"
                            description={`¿Seguro deseas eliminar el usuario: ${deletedUser.nombre_completo}?`}
                            buttonCancel="¡No, eliminar!"
                            buttonConfirm="¡Si, eliminar!"
                            onClickConfirm={handleChangeState}
                          />
                        </AlertDialog>
                      )
                    }

                  </TableBody>
                </Table>
              </div>
            </div>
          )
      }
    </div>
  )
}
