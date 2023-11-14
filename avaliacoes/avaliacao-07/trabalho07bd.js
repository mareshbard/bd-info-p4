const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3199;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('Loja2.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Crie a tabela TB_ALUNOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS TB_CLIENTES (ID INTEGER PRIMARY KEY AUTOINCREMENT, NOME_CLI TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CLIENTES:', err.message);
        } else {
            console.log('Tabela TB_CLIENTES criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_NOTAS_FISCAIS (ID INTEGER PRIMARY KEY AUTOINCREMENT, VALOR INTEGER NOT NULL, CLIENTE_ID INTEGER NOT NULL, VENDEDOR_ID INTEGER NOT NULL, foreign key (CLIENTE_ID) REFERENCES TB_CLIENTES(ID),  foreign key (VENDEDOR_ID) REFERENCES TB_CLIENTES(ID))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_NOTAS_FISCAIS criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_VENDEDOR (ID INTEGER PRIMARY KEY AUTOINCREMENT, NOME_VEND TEXT NOT NULL)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_VENDEDOR:', err.message);
        } else {
            console.log('Tabela TB_VENDEDOR criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_PRODUTOS (ID INTEGER PRIMARY KEY AUTOINCREMENT, DESC TEXT NOT NULL, PRECO_UNIT REAL NOT NULL)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_PRODUTOS:', err.message);
        } else {
            console.log('Tabela TB_PRODUTOS criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_ITENS_NOTAFISCAL (ID INTEGER PRIMARY KEY AUTOINCREMENT, QTD FLOAT, UNIDADE INTEGER, NOTAFISCAL_ID INTEGER, PRODUTO_ID INTEGER, FOREIGN KEY (NOTAFISCAL_ID) REFERENCES TB_NOTAS_FISCAIS(ID), FOREIGN KEY (PRODUTO_ID) REFERENCES TB_PRODUTOS(ID))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_ITENS_NOTAFISCAL:', err.message);
        } else {
            console.log('Tabela TB_ITENS_NOTAFISCAL criada com sucesso.');
        }
    }
);



app.post('/clientes', (req, res) => {
    const {  NOME_CLI } = req.body;
    db.run('INSERT INTO TB_CLIENTES (NOME_CLI) VALUES (?)', [NOME_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    });
});


app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM TB_CLIENTES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ clientes: rows });
    });
});


app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_CLIENTES WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Cliente não encontrado' });
            return;
        }
        res.json({ aluno: row });
    });
});

app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { NOME_CLI } = req.body;
    db.run('UPDATE TB_CLIENTES SET NOME_CLI = ? WHERE id = ?', [NOME_CLI, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
});


app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_CLIENTES WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente excluído com sucesso' });
    });
});












app.get('/vendedor', (req, res) => {
    db.all('SELECT * FROM TB_VENDEDOR', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedor: rows });
    });
});


app.get('/vendedor/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_VENDEDOR WHERE ID = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Vendedor não encontrado' });
            return;
        }
        res.json({ vendedor: row });
    });
});

app.put('/vendedor/:id', (req, res) => {
    const { id } = req.params;
    const { NOME_VEND } = req.body; 
    db.run('UPDATE TB_VENDEDOR SET NOME_VEND = ? WHERE ID = ?', [NOME_VEND, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor atualizado com sucesso' });
    });
});


app.delete('/vendedor/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_VENDEDOR WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor excluído com sucesso' });
    });
});
app.post('/vendedor', (req, res) => {
    const {  NOME_VEND } = req.body;
    db.run('INSERT INTO TB_VENDEDOR (NOME_VEND) VALUES (?)', [NOME_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
});









app.get('/notafiscal', (req, res) => {
    db.all('SELECT * FROM TB_NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ notafiscal: rows });
    });
});


app.get('/notafiscal/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_NOTAS_FISCAIS WHERE ID = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Nota Fiscal não encontrada' });
            return;
        }
        res.json({ notafiscal: row });
    });
});

app.put('/notafiscal/:id', (req, res) => {
    const { id } = req.params;
    const { VALOR, CLIENTE_ID, VENDEDOR_ID } = req.body;
    db.run('UPDATE TB_NOTAS_FISCAIS SET VALOR = ?, CLIENTE_ID = ?, VENDEDOR_ID = ? WHERE id = ?', [VALOR, CLIENTE_ID, VENDEDOR_ID , id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota fiscal atualizada com sucesso' });
    });
});


app.delete('/notafiscal/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_NOTAS_FISCAIS WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota fiscal excluída com sucesso' });
    });
});
app.post('/notafiscal', (req, res) => {
    const { VALOR, CLIENTE_ID, VENDEDOR_ID } = req.body;
    db.run('INSERT INTO TB_NOTAS_FISCAIS (VALOR, CLIENTE_ID, VENDEDOR_ID) VALUES (?, ?, ?)', [VALOR, CLIENTE_ID, VENDEDOR_ID], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Nota fiscal criada com sucesso' });
    });
});



app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM TB_PRODUTOS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produtos: rows });
    });
});


app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_PRODUTOS WHERE ID = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.json({ produtos : row });
    });
});

app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { DESC, PRECO_UNIT } = req.body;
    db.run('UPDATE TB_PRODUTOS SET DESC = ?, PRECO_UNIT = ? WHERE ID = ?', [DESC, PRECO_UNIT, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});


app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_PRODUTOS WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto excluído com sucesso' });
    });
});

app.post('/produtos', (req, res) => {
    const { DESC, PRECO_UNIT } = req.body;
    db.run('INSERT INTO TB_PRODUTOS (DESC, PRECO_UNIT) VALUES (?, ?)', [DESC, PRECO_UNIT], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Produto criada com sucesso' });
    });
});



app.get('/itemnotafiscal', (req, res) => {
    db.all('SELECT * FROM TB_ITENS_NOTAFISCAL', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ itemnotafiscal : rows });
    });
});


app.get('/itemnotafiscal/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_ITENS_NOTAFISCAL WHERE ID = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Não encontrado' });
            return;
        }
        res.json({ itensNota : row });
    });
});

app.put('/itemnotafiscal/:id', (req, res) => {
    const { id } = req.params;
    const { UNIDADE, QTD, NOTAFISCAL_ID,  PRODUTO_ID } = req.body; 
    db.run('UPDATE TB_ITENS_NOTAFISCAL SET UNIDADE = ?, QTD = ?, NOTAFISCAL_ID = ?, PRODUTO_ID = ? WHERE ID = ?', [UNIDADE, QTD, NOTAFISCAL_ID, PRODUTO_ID, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Atualizado com sucesso' });
    });
});
app.post('/itemnotafiscal', (req, res) => {
    const { UNIDADE, QTD, NOTAFISCAL_ID, PRODUTO_ID } = req.body;
    db.run('INSERT INTO TB_ITENS_NOTAFISCAL (UNIDADE, QTD, NOTAFISCAL_ID, PRODUTO_ID) VALUES (?, ?, ?, ?)', [UNIDADE, QTD, NOTAFISCAL_ID, PRODUTO_ID], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Criado com sucesso' });
    });
});

app.delete('/itemnotafiscal/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_ITENS_NOTAFISCAL WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Excluído com sucesso' });
    });
});



// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});