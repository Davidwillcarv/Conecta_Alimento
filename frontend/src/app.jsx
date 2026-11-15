import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Edit,
  Filter,
  LogOut,
  Package,
  PlusCircle,
  Save,
  Search,
  Trash2,
  Users,
  UserPlus,
} from "lucide-react";
import api from "./services/api";

const INITIAL_DONATION_FORM = {
  name: "",
  category: "Grãos",
  quantity: "",
  unit: "unidades",
  receiveDate: "",
  validDate: "",
};

const INITIAL_FAMILY_FORM = {
  name: "",
  responsibleName: "",
  membersCount: "",
  city: "",
  address: "",
  phone: "",
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken")),
  );
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [donations, setDonations] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [donationForm, setDonationForm] = useState(INITIAL_DONATION_FORM);
  const [familyForm, setFamilyForm] = useState(INITIAL_FAMILY_FORM);
  const [familySearch, setFamilySearch] = useState("");
  const [editingFamilyId, setEditingFamilyId] = useState(null);

  const calculateAlertStatus = (validDate) => {
    if (!validDate) return "Sem data";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(validDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "ALERTA: VENCIDO!";
    if (diffDays === 0) return "ALERTA: Vence hoje!";
    if (diffDays <= 3) return `ALERTA: Vence em ${diffDays} dia(s)!`;
    return "Em dia";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchDonations();
    fetchFamilies();
  }, [isAuthenticated]);

  const fetchDonations = () => {
    setLoading(true);
    api
      .get("/donations")
      .then((response) => {
        setDonations(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar doações:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFamilies = () => {
    api
      .get("/families")
      .then((response) => {
        setFamilies(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar famílias:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    api
      .post("/auth/login", {
        username: authForm.username,
        password: authForm.password,
      })
      .then((response) => {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("authUser", authForm.username);
        setIsAuthenticated(true);
        setAuthForm({ username: "", password: "" });
      })
      .catch(() => {
        setAuthError("Usuário ou senha inválidos.");
      })
      .finally(() => {
        setAuthLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setIsAuthenticated(false);
    setCurrentScreen("dashboard");
    setDonations([]);
    setFamilies([]);
  };

  const handleSaveDonation = (event) => {
    event.preventDefault();
    if (
      !donationForm.name ||
      !donationForm.quantity ||
      !donationForm.validDate
    ) {
      alert("Por favor, preencha os campos obrigatórios da doação.");
      return;
    }

    const payload = {
      name: donationForm.name,
      category: donationForm.category,
      quantity: Number(donationForm.quantity),
      unit: donationForm.unit,
      receiveDate: donationForm.receiveDate || null,
      validDate: donationForm.validDate,
    };

    api
      .post("/donations", payload)
      .then((response) => {
        setDonations([response.data, ...donations]);
        setDonationForm(INITIAL_DONATION_FORM);
        setCurrentScreen("dashboard");
      })
      .catch((error) => {
        console.error("Erro ao salvar doação:", error);
        alert("Não foi possível salvar a doação.");
      });
  };

  const handleSaveFamily = (event) => {
    event.preventDefault();
    if (
      !familyForm.name ||
      !familyForm.responsibleName ||
      !familyForm.membersCount ||
      !familyForm.city ||
      !familyForm.address ||
      !familyForm.phone
    ) {
      alert("Preencha todos os campos da família.");
      return;
    }

    const payload = {
      ...familyForm,
      membersCount: Number(familyForm.membersCount),
    };

    const request = editingFamilyId
      ? api.put(`/families/${editingFamilyId}`, payload)
      : api.post("/families", payload);

    request
      .then(() => {
        setFamilyForm(INITIAL_FAMILY_FORM);
        setEditingFamilyId(null);
        fetchFamilies();
      })
      .catch((error) => {
        console.error("Erro ao salvar família:", error);
        alert("Não foi possível salvar a família.");
      });
  };

  const handleEditFamily = (family) => {
    setFamilyForm({
      name: family.name,
      responsibleName: family.responsibleName,
      membersCount: String(family.membersCount),
      city: family.city,
      address: family.address,
      phone: family.phone,
    });
    setEditingFamilyId(family.id);
    setCurrentScreen("families");
  };

  const handleDeleteFamily = (id) => {
    if (!window.confirm("Deseja realmente excluir esta família?")) {
      return;
    }

    api
      .delete(`/families/${id}`)
      .then(() => {
        fetchFamilies();
      })
      .catch((error) => {
        console.error("Erro ao excluir família:", error);
        alert("Não foi possível excluir a família.");
      });
  };

  const clearFamilyForm = () => {
    setFamilyForm(INITIAL_FAMILY_FORM);
    setEditingFamilyId(null);
  };

  const filteredFamilies = useMemo(() => {
    const searchTerm = familySearch.trim().toLowerCase();
    if (!searchTerm) {
      return families;
    }

    return families.filter((family) => {
      const byName = family.name.toLowerCase().includes(searchTerm);
      const byCity = family.city.toLowerCase().includes(searchTerm);
      const byResponsible = family.responsibleName
        .toLowerCase()
        .includes(searchTerm);
      return byName || byCity || byResponsible;
    });
  }, [families, familySearch]);

  const alertCount = donations.filter((donation) =>
    calculateAlertStatus(donation.validDate).includes("ALERTA"),
  ).length;

  let stockContent;
  if (loading) {
    stockContent = (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        A carregar estoque do servidor...
      </div>
    );
  } else if (donations.length === 0) {
    stockContent = (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        Nenhuma doação cadastrada no momento.
      </div>
    );
  } else {
    stockContent = donations.map((item) => {
      const alertMessage = calculateAlertStatus(item.validDate);
      const hasAlert = alertMessage.includes("ALERTA");

      return (
        <div
          key={item.id}
          className={`p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 ${
            hasAlert
              ? "bg-amber-50 border-amber-300"
              : "bg-white border-gray-200"
          }`}
        >
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-xl text-gray-900">{item.name}</h4>
              <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1 flex items-center space-x-4">
              <span>
                Qtd:{" "}
                <strong>
                  {item.quantity} {item.unit}
                </strong>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>
                  Validade: <strong>{item.validDate}</strong>
                </span>
              </span>
            </p>
          </div>

          {hasAlert && (
            <div className="bg-amber-400 text-amber-950 font-extrabold px-4 py-3 rounded-lg flex items-center space-x-2 border border-amber-500 min-h-[48px] justify-center">
              <AlertTriangle size={22} className="text-amber-950" />
              <span className="text-sm tracking-wide">{alertMessage}</span>
            </div>
          )}
        </div>
      );
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-extrabold text-blue-950 mb-2">
            Conecta Alimento
          </h1>
          <p className="text-sm text-gray-500 mb-5">
            Faça login para gerenciar doações e famílias.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-username"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Usuário
              </label>
              <input
                id="login-username"
                type="text"
                value={authForm.username}
                onChange={(event) =>
                  setAuthForm({ ...authForm, username: event.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  setAuthForm({ ...authForm, password: event.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>

            {authError && (
              <div className="text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-70"
            >
              {authLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            Usuário padrão: <strong>admin</strong> / Senha:{" "}
            <strong>admin123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-12">
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center font-bold text-lg">
            👤
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              Conecta Alimento
            </h1>
            <p className="text-xs text-blue-200">
              Associação Comunitária Esperança
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 px-4 py-2.5 rounded-lg text-sm font-semibold transition min-h-[48px]"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg min-h-[48px] ${
              currentScreen === "dashboard"
                ? "font-semibold text-blue-700 border-b-2 border-blue-700 bg-white"
                : "font-medium text-gray-600 hover:text-blue-700"
            }`}
          >
            <Package size={20} />
            <span>Estoque & Alertas</span>
          </button>
          <button
            onClick={() => setCurrentScreen("families")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg min-h-[48px] ${
              currentScreen === "families"
                ? "font-semibold text-blue-700 border-b-2 border-blue-700 bg-white"
                : "font-medium text-gray-600 hover:text-blue-700"
            }`}
          >
            <Users size={20} />
            <span>Famílias ({families.length})</span>
          </button>
        </div>

        {currentScreen === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-950">
                  Conecta Alimento
                </h2>
                <p className="text-gray-500 text-sm">
                  Painel do Armazém Comunitário
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentScreen("families")}
                  className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-lg min-h-[48px]"
                >
                  <Users size={18} />
                  <span>GERENCIAR FAMÍLIAS</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("donationForm")}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow-sm transition min-h-[48px]"
                >
                  <PlusCircle size={18} />
                  <span>+ NOVA DOAÇÃO</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Doações Registradas
                  </p>
                  <p className="text-3xl font-extrabold text-blue-950 mt-1">
                    {donations.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Package size={28} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Famílias Ativas
                  </p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                    {families.length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Users size={28} />
                </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Alertas de Vencimento
                  </p>
                  <p className="text-3xl font-extrabold text-amber-600 mt-1">
                    {alertCount}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                  <AlertTriangle size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3.5 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar alimento por nome..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={18} />
                <select className="border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-700 font-medium min-h-[48px]">
                  <option>Todas as Categorias</option>
                  <option>Grãos</option>
                  <option>Perecíveis</option>
                  <option>Hortifruti</option>
                  <option>Não Perecíveis</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 text-lg flex items-center space-x-2">
                <span>ESTOQUE ATUAL</span>
                <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {donations.length} itens exibidos
                </span>
              </h3>
              {stockContent}
            </div>
          </div>
        )}

        {currentScreen === "donationForm" && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-950 mb-1">
              Cadastrar Nova Doação
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Preencha os dados do alimento recebido no armazém comunitário.
            </p>

            <form onSubmit={handleSaveDonation} className="space-y-5">
              <div>
                <label
                  htmlFor="donation-name"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Nome do Item *
                </label>
                <input
                  id="donation-name"
                  type="text"
                  required
                  placeholder="Ex: Feijão Preto 1kg"
                  value={donationForm.name}
                  onChange={(event) =>
                    setDonationForm({
                      ...donationForm,
                      name: event.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="donation-category"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Categoria *
                  </label>
                  <select
                    id="donation-category"
                    value={donationForm.category}
                    onChange={(event) =>
                      setDonationForm({
                        ...donationForm,
                        category: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white min-h-[48px]"
                  >
                    <option>Grãos</option>
                    <option>Perecíveis</option>
                    <option>Hortifruti</option>
                    <option>Não Perecíveis</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="donation-unit"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Unidade de Medida *
                  </label>
                  <select
                    id="donation-unit"
                    value={donationForm.unit}
                    onChange={(event) =>
                      setDonationForm({
                        ...donationForm,
                        unit: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white min-h-[48px]"
                  >
                    <option>unidades</option>
                    <option>kg</option>
                    <option>litros</option>
                    <option>pacotes</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="donation-quantity"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Quantidade *
                </label>
                <input
                  id="donation-quantity"
                  type="number"
                  min="1"
                  required
                  value={donationForm.quantity}
                  onChange={(event) =>
                    setDonationForm({
                      ...donationForm,
                      quantity: event.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="donation-receive-date"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Data de Recebimento
                  </label>
                  <input
                    id="donation-receive-date"
                    type="date"
                    value={donationForm.receiveDate}
                    onChange={(event) =>
                      setDonationForm({
                        ...donationForm,
                        receiveDate: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 min-h-[48px]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="donation-valid-date"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Data de Validade *
                  </label>
                  <input
                    id="donation-valid-date"
                    type="date"
                    required
                    value={donationForm.validDate}
                    onChange={(event) =>
                      setDonationForm({
                        ...donationForm,
                        validDate: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 min-h-[48px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("dashboard")}
                  className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 min-h-[48px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md min-h-[48px]"
                >
                  + SALVAR DOAÇÃO
                </button>
              </div>
            </form>
          </div>
        )}

        {currentScreen === "families" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-blue-950 mb-1">
                Gerenciar Famílias
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Cadastre, edite e remova famílias beneficiárias.
              </p>

              <form
                onSubmit={handleSaveFamily}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label
                    htmlFor="family-name"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Nome da Família *
                  </label>
                  <input
                    id="family-name"
                    type="text"
                    value={familyForm.name}
                    onChange={(event) =>
                      setFamilyForm({ ...familyForm, name: event.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="family-responsible"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Responsável *
                  </label>
                  <input
                    id="family-responsible"
                    type="text"
                    value={familyForm.responsibleName}
                    onChange={(event) =>
                      setFamilyForm({
                        ...familyForm,
                        responsibleName: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="family-members"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Quantidade de Membros *
                  </label>
                  <input
                    id="family-members"
                    type="number"
                    min="1"
                    value={familyForm.membersCount}
                    onChange={(event) =>
                      setFamilyForm({
                        ...familyForm,
                        membersCount: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="family-city"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Cidade *
                  </label>
                  <input
                    id="family-city"
                    type="text"
                    value={familyForm.city}
                    onChange={(event) =>
                      setFamilyForm({ ...familyForm, city: event.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="family-address"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Endereço *
                  </label>
                  <input
                    id="family-address"
                    type="text"
                    value={familyForm.address}
                    onChange={(event) =>
                      setFamilyForm({
                        ...familyForm,
                        address: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="family-phone"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Telefone *
                  </label>
                  <input
                    id="family-phone"
                    type="text"
                    value={familyForm.phone}
                    onChange={(event) =>
                      setFamilyForm({
                        ...familyForm,
                        phone: event.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                  >
                    {editingFamilyId ? (
                      <Save size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )}
                    {editingFamilyId
                      ? "Atualizar Família"
                      : "Cadastrar Família"}
                  </button>

                  {editingFamilyId && (
                    <button
                      type="button"
                      onClick={clearFamilyForm}
                      className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                    >
                      Cancelar edição
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">
                  Famílias cadastradas
                </h3>
                <input
                  type="text"
                  value={familySearch}
                  onChange={(event) => setFamilySearch(event.target.value)}
                  placeholder="Buscar por família, responsável ou cidade"
                  className="w-full md:w-96 border border-gray-300 rounded-lg p-2.5"
                />
              </div>

              {filteredFamilies.length === 0 ? (
                <p className="text-gray-500">Nenhuma família encontrada.</p>
              ) : (
                <div className="space-y-3">
                  {filteredFamilies.map((family) => (
                    <div
                      key={family.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{family.name}</p>
                        <p className="text-sm text-gray-600">
                          Responsável: {family.responsibleName} | Cidade:{" "}
                          {family.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          Membros: {family.membersCount} | Telefone:{" "}
                          {family.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          Endereço: {family.address}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditFamily(family)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFamily(family.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
