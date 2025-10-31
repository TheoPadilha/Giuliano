// src/pages/StyleGuide.jsx - Design System Documentation
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck, FiX, FiAlertCircle, FiInfo, FiStar, FiHeart,
  FiHome, FiUser, FiSettings, FiMail, FiLock, FiSearch
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

const StyleGuide = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const colors = {
    primary: [
      { name: "Rausch", value: "#FF385C", class: "bg-rausch" },
      { name: "Rausch Dark", value: "#E61E4D", class: "bg-rausch-dark" },
      { name: "Rausch Light", value: "#FF5A5F", class: "bg-rausch-light" },
    ],
    grays: [
      { name: "Airbnb Black", value: "#222222", class: "bg-airbnb-black" },
      { name: "Grey 900", value: "#484848", class: "bg-airbnb-grey-900" },
      { name: "Grey 700", value: "#717171", class: "bg-airbnb-grey-700" },
      { name: "Grey 500", value: "#8a8a8a", class: "bg-airbnb-grey-500" },
      { name: "Grey 400", value: "#b0b0b0", class: "bg-airbnb-grey-400" },
      { name: "Grey 300", value: "#c4c4c4", class: "bg-airbnb-grey-300" },
      { name: "Grey 200", value: "#dddddd", class: "bg-airbnb-grey-200" },
      { name: "Grey 100", value: "#ebebeb", class: "bg-airbnb-grey-100" },
      { name: "Grey 50", value: "#f7f7f7", class: "bg-airbnb-grey-50" },
    ],
    semantic: [
      { name: "Success", value: "#008A05", class: "bg-green-600" },
      { name: "Error", value: "#C13515", class: "bg-red-600" },
      { name: "Warning", value: "#E07912", class: "bg-orange-600" },
      { name: "Info", value: "#428BFF", class: "bg-blue-500" },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-airbnb-grey-50 border-b border-airbnb-grey-200">
        <div className="container-main py-8">
          <Link
            to="/"
            className="inline-flex items-center link-subtle mb-4"
          >
            <FaArrowLeft className="mr-2" size={16} />
            Voltar para Home
          </Link>
          <h1 className="heading-1 mb-4">Giuliano Design System</h1>
          <p className="body-large text-airbnb-grey-600">
            Sistema de design completo baseado na identidade visual Airbnb
          </p>
        </div>
      </div>

      <div className="container-main py-12">
        {/* Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <nav className="lg:sticky lg:top-8 lg:self-start">
            <div className="card">
              <div className="card-body">
                <h3 className="heading-4 mb-4">Conteúdo</h3>
                <ul className="space-y-2 body-small">
                  <li><a href="#colors" className="link">Cores</a></li>
                  <li><a href="#typography" className="link">Tipografia</a></li>
                  <li><a href="#buttons" className="link">Botões</a></li>
                  <li><a href="#forms" className="link">Formulários</a></li>
                  <li><a href="#cards" className="link">Cards</a></li>
                  <li><a href="#badges" className="link">Badges</a></li>
                  <li><a href="#alerts" className="link">Alertas</a></li>
                  <li><a href="#icons" className="link">Ícones</a></li>
                  <li><a href="#layout" className="link">Layout</a></li>
                  <li><a href="#utilities" className="link">Utilitários</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="lg:col-span-3 space-y-16">
            {/* Colors Section */}
            <section id="colors">
              <h2 className="heading-2 mb-6">Paleta de Cores</h2>

              {/* Primary Colors */}
              <div className="mb-8">
                <h3 className="heading-3 mb-4">Cores Primárias</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {colors.primary.map((color) => (
                    <div key={color.name} className="card">
                      <div className={`${color.class} h-24 rounded-t-xlarge`}></div>
                      <div className="card-body">
                        <p className="font-semibold text-airbnb-black">{color.name}</p>
                        <p className="text-sm text-airbnb-grey-600">{color.value}</p>
                        <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                          {color.class}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gray Scale */}
              <div className="mb-8">
                <h3 className="heading-3 mb-4">Escala de Cinzas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {colors.grays.map((color) => (
                    <div key={color.name} className="card">
                      <div className={`${color.class} h-16 rounded-t-xlarge`}></div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-airbnb-black">{color.name}</p>
                        <p className="text-xs text-airbnb-grey-600">{color.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h3 className="heading-3 mb-4">Cores Semânticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.semantic.map((color) => (
                    <div key={color.name} className="card">
                      <div className={`${color.class} h-16 rounded-t-xlarge`}></div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-airbnb-black">{color.name}</p>
                        <p className="text-xs text-airbnb-grey-600">{color.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Typography Section */}
            <section id="typography">
              <h2 className="heading-2 mb-6">Tipografia</h2>
              <div className="space-y-6">
                <div>
                  <h1 className="heading-1">Heading 1 - The quick brown fox</h1>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .heading-1
                  </code>
                </div>
                <div>
                  <h2 className="heading-2">Heading 2 - The quick brown fox</h2>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .heading-2
                  </code>
                </div>
                <div>
                  <h3 className="heading-3">Heading 3 - The quick brown fox</h3>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .heading-3
                  </code>
                </div>
                <div>
                  <h4 className="heading-4">Heading 4 - The quick brown fox</h4>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .heading-4
                  </code>
                </div>
                <div>
                  <p className="body-large">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .body-large
                  </code>
                </div>
                <div>
                  <p className="body-base">Body Base - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .body-base
                  </code>
                </div>
                <div>
                  <p className="body-small">Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-2 inline-block">
                    .body-small
                  </code>
                </div>
              </div>
            </section>

            {/* Buttons Section */}
            <section id="buttons">
              <h2 className="heading-2 mb-6">Botões</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="heading-4 mb-4">Variantes</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="btn-primary">Primary Button</button>
                    <button className="btn-secondary">Secondary Button</button>
                    <button className="btn-outline">Outline Button</button>
                    <button className="btn-ghost">Ghost Button</button>
                    <button className="btn-success">Success Button</button>
                    <button className="btn-danger">Danger Button</button>
                  </div>
                </div>

                <div>
                  <h3 className="heading-4 mb-4">Tamanhos</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <button className="btn-primary-small">Small</button>
                    <button className="btn-primary">Default</button>
                    <button className="btn-primary-large">Large</button>
                  </div>
                </div>

                <div>
                  <h3 className="heading-4 mb-4">Estados</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="btn-primary">Normal</button>
                    <button className="btn-primary" disabled>Disabled</button>
                    <button className="btn-primary">
                      <div className="flex items-center">
                        <div className="spinner-sm mr-2"></div>
                        Loading...
                      </div>
                    </button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h4 className="heading-4 mb-3">Código de Exemplo</h4>
                    <pre className="bg-airbnb-grey-50 p-4 rounded-lg overflow-x-auto text-sm">
{`<button className="btn-primary">
  Primary Button
</button>

<button className="btn-secondary">
  Secondary Button
</button>

<button className="btn-primary" disabled>
  Disabled
</button>`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Forms Section */}
            <section id="forms">
              <h2 className="heading-2 mb-6">Formulários</h2>
              <div className="card">
                <div className="card-body space-y-6">
                  <div className="form-group">
                    <label className="label">Input Normal</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Digite algo..."
                    />
                    <p className="form-hint">Dica de preenchimento</p>
                  </div>

                  <div className="form-group">
                    <label className="label">Input com Ícone</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                      <input
                        type="email"
                        className="input pl-12"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Input com Erro</label>
                    <input
                      type="text"
                      className="input-error"
                      placeholder="Input inválido"
                    />
                    <p className="form-error">Este campo é obrigatório</p>
                  </div>

                  <div className="form-group">
                    <label className="label">Input com Sucesso</label>
                    <input
                      type="text"
                      className="input-success"
                      placeholder="Input válido"
                      value="exemplo@email.com"
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Textarea</label>
                    <textarea
                      className="input"
                      rows="4"
                      placeholder="Escreva sua mensagem..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-rausch border-2 border-airbnb-grey-300 rounded focus:ring-rausch focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-airbnb-grey-700">
                        Aceito os termos e condições
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Cards Section */}
            <section id="cards">
              <h2 className="heading-2 mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="heading-3 mb-2">Card Padrão</h3>
                    <p className="body-base text-airbnb-grey-600">
                      Este é um card básico com padding e sombra padrão.
                    </p>
                  </div>
                </div>

                <div className="card-hover">
                  <div className="card-body">
                    <h3 className="heading-3 mb-2">Card com Hover</h3>
                    <p className="body-base text-airbnb-grey-600">
                      Passe o mouse para ver o efeito de elevação.
                    </p>
                  </div>
                </div>

                <div className="card-featured">
                  <div className="card-body">
                    <h3 className="heading-3 mb-2">Card Destacado</h3>
                    <p className="body-base text-airbnb-grey-600">
                      Card com borda rausch e fundo levemente colorido.
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="heading-4">Card com Header</h3>
                  </div>
                  <div className="card-body">
                    <p className="body-base text-airbnb-grey-600">
                      Conteúdo do card.
                    </p>
                  </div>
                  <div className="card-footer">
                    <button className="btn-secondary btn-sm">Ação</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Badges Section */}
            <section id="badges">
              <h2 className="heading-2 mb-6">Badges</h2>
              <div className="flex flex-wrap gap-3">
                <span className="badge-rausch">Rausch</span>
                <span className="badge-success">Success</span>
                <span className="badge-warning">Warning</span>
                <span className="badge-error">Error</span>
                <span className="badge-info">Info</span>
                <span className="badge-premium">Premium</span>
              </div>

              <div className="card mt-6">
                <div className="card-body">
                  <h4 className="heading-4 mb-3">Código de Exemplo</h4>
                  <pre className="bg-airbnb-grey-50 p-4 rounded-lg overflow-x-auto text-sm">
{`<span className="badge-rausch">Rausch</span>
<span className="badge-success">Success</span>
<span className="badge-premium">Premium</span>`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Alerts Section */}
            <section id="alerts">
              <h2 className="heading-2 mb-6">Alertas</h2>
              <div className="space-y-4">
                <div className="alert-success">
                  <div className="flex items-start">
                    <FiCheck className="flex-shrink-0 mr-3 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold">Sucesso!</p>
                      <p className="text-sm">Sua ação foi concluída com sucesso.</p>
                    </div>
                  </div>
                </div>

                <div className="alert-error">
                  <div className="flex items-start">
                    <FiX className="flex-shrink-0 mr-3 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold">Erro!</p>
                      <p className="text-sm">Ocorreu um erro ao processar sua solicitação.</p>
                    </div>
                  </div>
                </div>

                <div className="alert-warning">
                  <div className="flex items-start">
                    <FiAlertCircle className="flex-shrink-0 mr-3 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold">Atenção!</p>
                      <p className="text-sm">Verifique as informações antes de continuar.</p>
                    </div>
                  </div>
                </div>

                <div className="alert-info">
                  <div className="flex items-start">
                    <FiInfo className="flex-shrink-0 mr-3 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold">Informação</p>
                      <p className="text-sm">Aqui está uma informação importante para você.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Icons Section */}
            <section id="icons">
              <h2 className="heading-2 mb-6">Ícones</h2>
              <p className="body-base text-airbnb-grey-600 mb-6">
                Usando React Icons (react-icons/fi e react-icons/fa)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[FiHome, FiUser, FiSettings, FiMail, FiLock, FiSearch,
                  FiStar, FiHeart, FiCheck, FiX, FiAlertCircle, FiInfo].map((Icon, idx) => (
                  <div key={idx} className="card text-center">
                    <div className="card-body">
                      <Icon className="mx-auto text-rausch mb-2" size={32} />
                      <code className="text-xs">{Icon.name}</code>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Layout Section */}
            <section id="layout">
              <h2 className="heading-2 mb-6">Layout</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="heading-3 mb-4">Container Principal</h3>
                  <code className="text-sm bg-airbnb-grey-50 px-3 py-2 rounded inline-block">
                    .container-main
                  </code>
                  <p className="body-small text-airbnb-grey-600 mt-2">
                    Max-width: 7xl (1280px), padding responsivo
                  </p>
                </div>

                <div>
                  <h3 className="heading-3 mb-4">Sections</h3>
                  <div className="space-y-2">
                    <code className="text-sm bg-airbnb-grey-50 px-3 py-2 rounded inline-block mr-2">
                      .section
                    </code>
                    <span className="text-sm text-airbnb-grey-600">py-16</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <code className="text-sm bg-airbnb-grey-50 px-3 py-2 rounded inline-block mr-2">
                      .section-small
                    </code>
                    <span className="text-sm text-airbnb-grey-600">py-12</span>
                  </div>
                </div>

                <div>
                  <h3 className="heading-3 mb-4">Divisor</h3>
                  <div className="divider mb-4"></div>
                  <code className="text-sm bg-airbnb-grey-50 px-3 py-2 rounded inline-block">
                    .divider
                  </code>
                </div>
              </div>
            </section>

            {/* Utilities Section */}
            <section id="utilities">
              <h2 className="heading-2 mb-6">Utilitários</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="heading-3 mb-4">Loading Spinners</h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="spinner-sm"></div>
                      <code className="text-xs mt-2 inline-block">.spinner-sm</code>
                    </div>
                    <div>
                      <div className="spinner-md"></div>
                      <code className="text-xs mt-2 inline-block">.spinner-md</code>
                    </div>
                    <div>
                      <div className="spinner-lg"></div>
                      <code className="text-xs mt-2 inline-block">.spinner-lg</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="heading-3 mb-4">Links</h3>
                  <div className="space-y-3">
                    <div>
                      <a href="#" className="link">Link padrão com underline</a>
                      <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded ml-3">
                        .link
                      </code>
                    </div>
                    <div>
                      <a href="#" className="link-subtle">Link sutil sem underline</a>
                      <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded ml-3">
                        .link-subtle
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="heading-3 mb-4">Scrollbar Customizada</h3>
                  <div className="card">
                    <div className="card-body">
                      <div className="h-32 overflow-y-auto scrollbar-custom">
                        <p className="body-base">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                      </div>
                      <code className="text-xs bg-airbnb-grey-50 px-2 py-1 rounded mt-3 inline-block">
                        .scrollbar-custom
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-airbnb-grey-50 border-t border-airbnb-grey-200 py-8">
        <div className="container-main text-center">
          <p className="body-small text-airbnb-grey-600">
            Giuliano Alquileres © 2025 - Design System v1.0
          </p>
          <p className="body-small text-airbnb-grey-500 mt-2">
            Baseado no design Airbnb
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
