#include "basic.h"

pid_t Fork(void)
{
    pid_t pid = fork();
    if (pid < 0)
    {
        // fprintf(stderr, "Fork error: %d \n", stderror(errno));
        exit(0);
    }

    return pid;
}