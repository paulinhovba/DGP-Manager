-- phpMyAdmin SQL Dump
-- version 4.4.15.1
-- http://www.phpmyadmin.net
--
-- Host: mysql942.umbler.com
-- Generation Time: 30-Maio-2020 às 09:38
-- Versão do servidor: 5.6.40
-- PHP Version: 5.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejsbd`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `clientes`
--

CREATE TABLE IF NOT EXISTS `clientes` (
  `Id` int(11) NOT NULL,
  `Nome` varchar(255) NOT NULL,
  `Endereco` varchar(255) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Celular` varchar(14) NOT NULL,
  `Telefone` varchar(14) NOT NULL,
  `FlagStatus` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `clientes`
--

INSERT INTO `clientes` (`Id`, `Nome`, `Endereco`, `Email`, `Celular`, `Telefone`, `FlagStatus`) VALUES
(1, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '54992534085', '54992534085', 0),
(2, 'Chayane Machado', 'Rua Assis Brasil, 560', 'chaianemachado@gmail.com', '992113004', '992113004', 0),
(3, 'Antônio Marin', 'Rua Antares, 321', 'pmarin@hotmail.com', '54992334566', '54992118890', 0),
(4, 'Pedro Antônio Marin', 'Rua Antares, 321', 'pmarin@hotmail.com', '54992334566', '54992118890', 0),
(5, 'Mario Jorge Lobo Zagallo', 'Rua Coronel Pena de Moraes, 227', 'ehtetra@gmail.com', '+5554992534', '+5554992534', 0),
(6, 'Patrick Douglas Monteiro', 'Rua Assis Brasil', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(7, 'Viviane Araujo', 'Rua Botafogo, 100', 'viviaraujo@gmail.com', '2199226789', '2199337890', 0),
(8, 'Teresa da Silva Sauro', 'Rua dos Mordomos, 344', 'terezinha@gmail.com', '+5554992534', '+5554992534', 0),
(9, 'Nadir Antonio Antonioli', 'Rua Vereador Mario Pezzi, 1987', 'nadiranto@nioli.com.br', '+5554992534', '+5554992534', 0),
(10, 'Marcelo Barros Silva', 'Rua Caramuru, 2345', 'malmeida@hotmail.com', '+5554992534', '+5554992588', 0),
(11, 'Kelen Patricia Ramos Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'kelenmonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(12, 'Ana Cristina Silva', 'Rua Assis Brasil, 69', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992588', 0),
(13, 'Georgina de Jesus', 'Rua Assis Brasil 257,', 'faleco@gmail.com', '+5554992534', '+5554992534', 0),
(14, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(15, 'Chapeuzinho Vermelho', 'Rua Assis Brasil', 'omonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(16, 'Leonardo Zanandrea', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 0),
(17, 'Leonardo Zanandrea', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(18, 'Daia Zanandrea Moreira', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(19, 'Daia Zanandrea', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(20, 'Chaia Zanandrea Monteiro', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(21, 'Zeca Urubu', 'Rua dos Mordomos, 344', 'zeca@urubu.com', '+5554992534', '+5554992534', 1),
(22, 'Picolino Pinguim', 'Rua Assis Brasil, 345', 'picolino@gmail.com', '+5554992534', '+5554992534', 1),
(23, 'Paulo R Monteiro', 'Rua Assis Brasil', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(24, 'Antônio Marin', 'Rua Antares, 321', 'pmarin@hotmail.com', '54992334566', '54992118890', 0),
(25, 'Antônio Marin', 'Rua Antares, 321', 'pmarin@hotmail.com', '54992334566', '54992118890', 0),
(26, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(27, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(28, 'Ana Maria Braga', 'Rua Globo, 12345', 'ana.maria@globo.com', '+5554992534', '+5554992534', 1),
(29, 'Jorge Fernando', 'Rua Globo, 12345', 'jfnando@globo.com', '+5554992534', '+5554992534', 0),
(30, 'Marcelo Fernando', 'Rua Globo, 12345', 'jfnando@globo.com', '+5554992534', '+5554992534', 1),
(31, 'Antônio Marin', 'Rua Antares, 321', 'pmarin@hotmail.com', '54992334566', '54992118890', 0),
(32, 'Cláudia Abreu', 'Rua Não Nem Eu, 1234', 'cacauabreu@globo.com', '+5554992534', '+5554992534', 1),
(33, 'Marilia Gabriela', 'Rua Globo, 12345', 'gabigabriela@globo.com', '+5554992534', '+5554992534', 1),
(34, 'Raposo Tavares', 'Av. Manuel Bandeira, 3456', 'rap_tav@history.com', '+5554992534', '+5554992534', 1),
(35, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(36, 'Antônio Marin', 'Rua Antares, 321', 'pmarin@hotmail.com', '54992334566', '54992118890', 0),
(37, 'Pedro Cardoso', 'Rua Globo, 12345', 'pedroca@gmail.com', '+5554992534', '+5554992534', 0),
(38, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(39, 'Rodrigo Sabanai', 'Rua São Paulo, 899', 'rsaba@gmail.com', '+5554992534', '+5554992534', 1),
(40, 'Patrick Monteiro', 'Rua Fátima, 233', 'pmonteiro@bb.com.br', '+5554992534', '+5554992534', 1),
(41, 'Maria Vai Com as Outras', 'Rua das Perdidas, 332', 'mvcoutras@gmail.com', '+5554992534', '+5554992534', 0),
(42, 'Maria Vai Com as Outras', 'Rua das Perdidas, 332', 'mvcoutras@gmail.com', '+5554992534', '+5554992534', 0),
(43, 'Maria Vai Com as Outras', 'Rua das Perdidas, 332', 'mvcoutras@gmail.com', '+5554992534', '+5554992534', 0),
(44, 'Maria Vai Com as Outras', 'Rua das Perdidas, 332', 'mvcoutras@gmail.com', '+5554992534', '+5554992534', 0),
(45, 'Maria Vai Com as Outras', 'Rua das Perdidas, 332', 'mvcoutras@gmail.com', '+5554992534', '+5554992534', 0),
(46, 'Porco Fumo Talian Silva', 'Rua dos Camadona, 123', 'camadona@gmail.com', '+5554992534', '+5554992534', 1),
(47, 'Tiago Silva Chorão', 'Rua da CBF, 667', 'tschorao@gmail.com', '+5554992534', '+5554992534', 1),
(48, 'Fred Cone Mascarado ', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(49, 'Fred Cone Mascarado ', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(50, 'Fred Cone Mascarado ', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(51, 'Paulo R Monteiro', 'Rua Assis Brasil', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(76, 'Marcela Marena', 'Rua Coronel Pena de Moraes, 123', 'marmar@gmail.com', '+5554992534', '+5554992534', 1),
(77, 'Mirian Cardoso', 'Rua Assis Brasil, 78', 'mcardoro@gmail.com', '+5554992534', '+5554992534', 1),
(78, 'Mirian Cardona', 'Rua Assis Brasil, 78', 'mcardoro@gmail.com', '+5554992534', '+5554992534', 0),
(79, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(80, 'Eu tô Confuso', 'Rua Coronel Pena de Moraes, 345', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 1),
(81, 'Ana Cristina Silva', 'Rua Assis Brasil', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 1),
(82, 'Daia Zanandrea', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(83, 'Daia Zanandrea', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(84, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 1),
(85, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 1),
(86, 'Marcelo Almeida', 'Rua Caramuru, 234', 'malmeida@hotmail.com', '+5554992534', '+5554992534', 1),
(87, 'Marcelo Almeida', 'Rua Caramuru, 234', 'malmeida@hotmail.com', '+5554992534', '+5554992534', 1),
(88, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 1),
(89, 'Daia Zanandrea', 'Rua Espirito Santo, 323', 'leozana@gmail.com', '+5554992534', '+5554992534', 1),
(90, 'Marcelo Almeida', 'Rua Caramuru, 234', 'malmeida@hotmail.com', '+5554992534', '+5554992534', 1),
(91, 'Chapeuzinho Vermelho', 'Rua Assis Brasil', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 1),
(92, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 0),
(93, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 1),
(94, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 0),
(95, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 0),
(96, 'Menina Veneno', 'Rua Seu Mundo é Pequeno, 2', 'abajurcarmim@ieieie.com', '+5554992534', '+5554992534', 0),
(97, 'Menina Veneno', 'Rua Seu Mundo é Pequeno, 2', 'abajurcarmim@ieieie.com', '+5554992534', '+5554992534', 1),
(98, 'Maria Jussara Guimarães da Silva', 'Rua Pedro Girelli, 234', 'mariaju@gmail.com', '54992339870', '5499235667', 0),
(118, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 1),
(119, 'Walter Marcel White', 'Rua Das Anfetaminas, 345', 'gremenmeyer@thedrugs.com', '+5554992534', '+5554992534', 1),
(120, 'Charles Dickens', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '02199253446', 1),
(121, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 1),
(122, 'Paulo Roberto Monteiro Garcia', 'Rua Nadir Antonio Antonioli, 2378', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 0),
(123, 'Paulo Roberto Monteiro', 'Rua Nadir Antonio Antonioli, 237', 'falecompaulinhomonteiro@gmail.com', '+5554992534', '+5554992534', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `contas`
--

CREATE TABLE IF NOT EXISTS `contas` (
  `Id` int(11) NOT NULL,
  `Descricao` varchar(255) NOT NULL,
  `FlagStatus` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `contas`
--

INSERT INTO `contas` (`Id`, `Descricao`, `FlagStatus`) VALUES
(1, 'Caixa', 1),
(2, 'Banco do Brasil', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `cotas`
--

CREATE TABLE IF NOT EXISTS `cotas` (
  `Id` int(11) NOT NULL,
  `Descricao` varchar(255) NOT NULL,
  `Valor` decimal(10,2) NOT NULL,
  `IdCliente` int(11) NOT NULL,
  `IdEmpreendimento` int(11) NOT NULL,
  `FlagStatus` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `cotas`
--

INSERT INTO `cotas` (`Id`, `Descricao`, `Valor`, `IdCliente`, `IdEmpreendimento`, `FlagStatus`) VALUES
(1, 'Cota Investimento ', '100.00', 1, 1, 1),
(2, 'Cota de Testes Futuros', '100.00', 1, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `empreendimentos`
--

CREATE TABLE IF NOT EXISTS `empreendimentos` (
  `Id` int(11) NOT NULL,
  `DataLancamento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Descricao` varchar(255) NOT NULL,
  `Localizacao` varchar(100) NOT NULL,
  `QuantidadeCotas` int(5) NOT NULL,
  `FlagStatus` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `empreendimentos`
--

INSERT INTO `empreendimentos` (`Id`, `DataLancamento`, `Descricao`, `Localizacao`, `QuantidadeCotas`, `FlagStatus`) VALUES
(1, '2020-05-02 20:05:00', 'Loteamento Altos do Cinquentenário', '', 100, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `lancamentos`
--

CREATE TABLE IF NOT EXISTS `lancamentos` (
  `Id` int(11) NOT NULL,
  `Data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Descricao` varchar(255) NOT NULL,
  `IdConta` int(11) NOT NULL,
  `Tipo` varchar(1) NOT NULL,
  `Valor` decimal(10,2) NOT NULL,
  `FlagStatus` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `lancamentos`
--

INSERT INTO `lancamentos` (`Id`, `Data`, `Descricao`, `IdConta`, `Tipo`, `Valor`, `FlagStatus`) VALUES
(1, '2020-05-02 20:25:00', 'Pagamento de Energia RGE', 2, 'S', '100.00', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `lotes`
--

CREATE TABLE IF NOT EXISTS `lotes` (
  `Id` int(11) NOT NULL,
  `Descricao` varchar(255) NOT NULL,
  `Quadra` varchar(255) NOT NULL,
  `Matricula` varchar(255) NOT NULL,
  `Metragem` int(5) NOT NULL,
  `Valor` decimal(10,2) NOT NULL,
  `IdCliente` int(11) NOT NULL,
  `IdEmpreendimento` int(11) NOT NULL,
  `idCota` int(11) DEFAULT NULL,
  `FlagStatus` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `lotes`
--

INSERT INTO `lotes` (`Id`, `Descricao`, `Quadra`, `Matricula`, `Metragem`, `Valor`, `IdCliente`, `IdEmpreendimento`, `idCota`, `FlagStatus`) VALUES
(1, 'Lote Teste Padrão', '1', '122-VN8', 728, '95000.00', 1, 1, NULL, 1),
(2, 'Lote Novo Padrão Dois', '7', '127-NVM', 728, '100.00', 2, 1, NULL, 1),
(3, 'Lote Testes Vínculo Cotas', 'UYTWE-76', '121-99', 728, '100.00', 1, 1, 2, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `contas`
--
ALTER TABLE `contas`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `cotas`
--
ALTER TABLE `cotas`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdCliente` (`IdCliente`),
  ADD KEY `IdEmpreendimento` (`IdEmpreendimento`);

--
-- Indexes for table `empreendimentos`
--
ALTER TABLE `empreendimentos`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `lancamentos`
--
ALTER TABLE `lancamentos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdConta` (`IdConta`);

--
-- Indexes for table `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdCliente` (`IdCliente`),
  ADD KEY `IdEmpreendimento` (`IdEmpreendimento`),
  ADD KEY `IdCota` (`idCota`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=124;
--
-- AUTO_INCREMENT for table `contas`
--
ALTER TABLE `contas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `cotas`
--
ALTER TABLE `cotas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `empreendimentos`
--
ALTER TABLE `empreendimentos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `lancamentos`
--
ALTER TABLE `lancamentos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `lotes`
--
ALTER TABLE `lotes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `cotas`
--
ALTER TABLE `cotas`
  ADD CONSTRAINT `cotas_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`Id`),
  ADD CONSTRAINT `cotas_ibfk_2` FOREIGN KEY (`IdEmpreendimento`) REFERENCES `empreendimentos` (`Id`);

--
-- Limitadores para a tabela `lancamentos`
--
ALTER TABLE `lancamentos`
  ADD CONSTRAINT `lancamentos_ibfk_1` FOREIGN KEY (`IdConta`) REFERENCES `contas` (`Id`);

--
-- Limitadores para a tabela `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `fk_cota` FOREIGN KEY (`idCota`) REFERENCES `cotas` (`Id`),
  ADD CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`Id`),
  ADD CONSTRAINT `lotes_ibfk_2` FOREIGN KEY (`IdEmpreendimento`) REFERENCES `empreendimentos` (`Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
