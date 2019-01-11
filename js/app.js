// Enemies our player must avoid
/**
* @description Representa um inimigo (inseto)
* @constructor
*/
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Posição inicial de início do inseto no eixo x.
    this.x = 0;

    // A posição inicial em relação ao eixo y.
    // A função Math.random()*3 determina "aleatoriamente"
    // qual das três linhas disponíveis os inimigos aparecerão. 
    // A função Math.ceil ajusta a saída para ser 1, 2 ou 3.
    // Multiplicando esse valor por 83 colocamos aproximadamente 
    // na posição desejada. A subtração por 20 faz um pequeno
    // ajuste para que o inseto fique no espaço devido.
    this.y = Math.ceil(Math.random()*3)*83 -20;

    // Caso o número aletório gerado seja igual 0, o inimigo
    // será posicionado no local errado. Esse caso é tratado,
    // atribuindo a y o valor resultante de um Math.ceil(Math.random()*3)
    // igual a 1 no cálculo acima.
    if(this.y == -20) 
        this.y = 63;

    // Propriedade que determina a velocidade do inseto.
    // Determinado aleatoriament. O valor máximo é 200 e o
    // mínimo é 100.
    this.step = Math.random()*100 + 100;
};

/**
* @description Checa se um inimigo saiu da área de visualização do
* Canvas e o reposiciona para aparecer novamente.
*/
Enemy.prototype.checkReposition = function(){
    // Verifica se o inimigo saiu da tela (limite à direita).
    if(this.x >= 505){

        // Reposiciona o inimigo à esquerda (fora da área visível).
        this.x = -101;

        // Reposiciona o inimigo em uma das posições devidas na
        // vertical aleatoriamente.
        this.y = Math.ceil(Math.random()*3)*83 -20;

        // Tratamento para caso o Math.random() seja igual a 0.
        if(this.y == -20) 
            this.y = 63;

        // Redefine aleatoriamente a velocidade do inseto.
        this.step = Math.random()*100 + 100;
    }
}

/**
* @description Checa se um inimigo colidiu com o jogador.
*/
Enemy.prototype.checkCollision = function(){

    // Verifica se o jogador e o inimigo estão ocupando o mesmo
    // espaço, o que caracteriza uma colisão. A partir da diferença
    // das propriedades de posição, determina-se a proximidade entre
    // o inimigo e o jogador. Se valor dessas diferenças forem baixas,
    // quer dizer que colidiram. O valor absoluto é usado para evitar
    // problemas com o sinal da diferença e os valores limites foram
    // definidos por tentativa e erro.
    if(Math.abs(this.x - player.x) < 70 && Math.abs(this.y - player.y) < 16){

        // Informa a variável player que houve uma colisão, para que
        // faça o tratamento adequado.
        player.collided = true;
    }
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

/**
* @description Atualiza a posição do inimigo.
* @param {number} dt - Delta.
*/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + dt*this.step;
    this.checkReposition();
    this.checkCollision();
};

// Draw the enemy on the screen, required method for game

/**
* @description Desenha o inimigo na tela.
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
* @description Representa um jogador.
* @constructor
*/
var Player = function(){

    // Imagem do jogador
    this.sprite = 'images/char-boy.png';

    // Posição horizontal do jogador.
    // Posiciona o jogador na terceira coluna.
    this.x = 202;

    // Posição vertical do jogador. Posiciona o jogador
    // na última linha. Calculou-se multiplicando o tamanho
    // vertical de cada quadrado com a quantidade de linhas-1
    // (já que a primeira é 0). Subtraiu-se 30 unidades para
    // melhor acomodar o jogador no espaço. Fórmula: 83*5-30.
    this.y = 385;

    // Propriedade que define a direção do próximo movimento
    // do jogador.
    this.nextMoviment = '';

    // Propriedade booleana que indica se ocorreu uma colisão.
    this.collided = false;
}

/**
* @description Movimenta o jogador de acordo com a tecla apertada.
*/
Player.prototype.checkMoviment = function(){
    
    //Não optou-se por fazer isso no handleInput porque preferiu-se
    // deixar todas as funções que mudam a posição do jogador dentro
    // do método update. Isso facilitaria um pouco o entendimento e 
    // manutenção do código.
    switch(this.nextMoviment){
        
        // O primeiro caso é o de não haver movimentos. É o caso de
        // maior ocorrência
        case '':
            break;

        // Todos verificam se o movimento está dentro dos limites
        // permitidos. Se estiver, atualiza a posição do jogador
        // de acordo com movimento.
        case 'up': 
            if(this.y - 83 >= -30){
                this.y = this.y - 83;
            }
            this.nextMoviment = '';
            break;
        case 'right':
            if(this.x + 101 < 505){
                this.x = this.x + 101;
            }
            this.nextMoviment = '';
            break;
        case 'left':
            if(this.x - 101 >= 0){
                this.x = this.x - 101;
            }
            this.nextMoviment = '';
            break;
        case 'down':
            if(this.y + 83 <= 385){
                this.y = this.y + 83;
            }
            this.nextMoviment = '';
            break;
    }
}

/**
* @description Verifica se o jogador venceu o jogo.
*/
Player.prototype.checkVictory = function(){
    
    // Verifica se o jogador se encontra dentro da
    // região de vitória.
    if(this.y < 0){
        
        // Dá uma mensagem de vitória e retorna o
        // jogador para o ponto de partida.
        alert("You win!");
        this.x = 202;
        this.y = 385;
    }
}

/**
* @description Verifica se o jogador colidiu com
* um inimigo (foi derrotado) e trata esse caso.
*/
Player.prototype.checkLoss = (function(){

    // O propósito desse contador é
    // dar um delay no retorno do personagem
    // para o ponto de inicio após a colisão
    // com o inimigo. Garante e torna mais
    // nítida a sobreposição da imagem do
    // jogador e a do inimigo, o que constata
    // a derrota.
    var count = 0;

    return function(){
        if(this.collided){
            if(count == 5){
                this.x = 202;
                this.y = 385;
                this.collided = false;
                count = 0;
            }else{
                count=count+1;
            }
        }
    }
})();

/**
* @description Atualiza a posição do jogador e checa
* casos de vitória e derrota.
*/
Player.prototype.update = function(){
    this.checkVictory();
    this.checkLoss();
    this.checkMoviment();
}

/**
* @description Renderiza o jogador.
*/
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
* @description Lida com a entrada do usuário
*/
Player.prototype.handleInput = function(direction){
    this.nextMoviment = direction;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
