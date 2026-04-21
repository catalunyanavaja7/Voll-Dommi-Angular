CREATE TABLE IF NOT EXISTS historial_productes (
  id INT NOT NULL AUTO_INCREMENT,
  firebase_uid VARCHAR(120) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  producte_id VARCHAR(120) NULL,
  producte_nom VARCHAR(255) NOT NULL,
  preu DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantitat INT NOT NULL DEFAULT 1,
  en_oferta TINYINT(1) NOT NULL DEFAULT 0,
  data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_historial_uid (firebase_uid),
  INDEX idx_historial_data (data_compra)
);
