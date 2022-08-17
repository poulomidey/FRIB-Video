export class random_num
{
    constructor()
    {
        this.wait_time = 0;
        this.break_time = 0;
    }

    choose_wait_time(tot_time)
    {
        this.wait_time = Math.random() * tot_time;
    }

    choose_break_time()
    {
        this.break_time = Math.random() * .25 + .125;
    }
}