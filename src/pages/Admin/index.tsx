/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  notification,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../../api/Companies";
import { deleteUser, getUsers, updateUser } from "../../api/Users";

const { Option } = Select;

export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export interface Users {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
}

const { Title } = Typography;

const Admin: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [companyForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  const handleEditUser = (user: Users) => {
    setEditingUser(user);
    userForm.setFieldsValue(user);
    setIsUserModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await userForm.validateFields();
      if (editingUser) {
        await updateUser(
          editingUser.id,
          values.name,
          values.email,
          values.company_id
        );
        api.success({
            message: "Usuário atualizado com sucesso!",
            description: "O usuário foi atualizado com sucesso.",
          });
        setIsUserModalVisible(false);
        fetchUsers();
      }
    } catch {
      api.error({
        message: "Erro ao atualizar usuário.",
        description: "Verifique os dados e tente novamente.",
      });
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    companyForm.setFieldsValue({ name: company.name });
    setIsCompanyModalVisible(true);
  };

  const handleUpdateCompany = async () => {
    try {
      const values = await companyForm.validateFields();
      if (editingCompany) {
        await updateCompany(editingCompany.id, values.name);
        api.success({
            message: "Empresa atualizada com sucesso!",
            description: "A empresa foi atualizada com sucesso.",
          });
        setIsCompanyModalVisible(false);
        fetchCompanies();
      }
    } catch {
      api.error({
        message: "Erro ao atualizar empresa.",
        description: "Verifique os dados e tente novamente.",
      });
    }
  };

  const companyColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Data de Criação",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) =>
        new Date(text).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: Company) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Editar empresa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditCompany(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja deletar esta Empresa?"
            onConfirm={async () => {
              await deleteCompany(record.id);
              api.success({
                message: "Empresa deletada com sucesso!",
                description: "A Empresa foi removido com sucesso.",
              });
              fetchCompanies();
            }}
            okText="Sim"
            cancelText="Cancelar"
          >
            <Tooltip title="Deletar empresa">
              <Button danger type="primary" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const userColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Empresa",
      dataIndex: "company_id",
      key: "company",
      render: (company_id: string) => {
        const company = companies.find((c) => c.id === company_id);
        return company ? company.name : "—";
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: Users) => (
        <div style={{ display: "flex", gap: 8 }}>

          <Tooltip title="Editar usuário">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja deletar este usuário?"
            onConfirm={async () => {
              await deleteUser(record.id);
              api.success({
                message: "Usuário deletado com sucesso!",
                description: "O usuário foi removido com sucesso.",
              });
              fetchUsers();
            }}
            okText="Sim"
            cancelText="Cancelar"
          >
            <Tooltip title="Deletar usuário">
              <Button danger type="primary" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24 }}>
        <Title style={{
          fontSize: 28,
        }}>Empresas</Title>
        <Table
          rowKey="id"
          columns={companyColumns}
          dataSource={companies}
          bordered
          pagination={{ pageSize: 10 }}
        />

        <Title style={{
          fontSize: 28,
        }}>Usuários</Title>
        <Table
          rowKey="id"
          columns={userColumns}
          dataSource={users}
          bordered
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Editar Empresa"
          open={isCompanyModalVisible}
          onCancel={() => setIsCompanyModalVisible(false)}
          onOk={handleUpdateCompany}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={companyForm} layout="vertical">
            <Form.Item
              label="Nome da empresa"
              name="name"
              rules={[{ required: true, message: "Informe o nome" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Editar Usuário"
          open={isUserModalVisible}
          onCancel={() => setIsUserModalVisible(false)}
          onOk={handleUpdateUser}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={userForm} layout="vertical">
            <Form.Item
              label="Nome"
              name="name"
              rules={[{ required: true, message: "Informe o nome" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Informe o email" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Empresa"
              name="company_id"
              rules={[{ required: true, message: "Selecione a empresa" }]}
            >
              <Select placeholder="Selecione uma empresa">
                {companies.map((company) => (
                  <Option key={company.id} value={company.id}>
                    {company.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Admin;
